#!/usr/bin/env bun

import { spawn } from 'node:child_process'
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'

import {
  measureRoute,
  REQUIRED_ROUTE_METRICS,
  runCommand,
  summarizeSamples,
} from './m0-benchmark.mjs'

const DEFAULT_CONFIG = 'benchmarks/m2-framework-evaluation.json'
const DEFAULT_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const delay = (milliseconds) =>
  new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds))

function parseArgs(args) {
  const options = { config: DEFAULT_CONFIG, candidates: new Set(), output: undefined, build: false }
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--config') options.config = args[++index]
    else if (argument === '--candidate') options.candidates.add(args[++index])
    else if (argument === '--output') options.output = args[++index]
    else if (argument === '--build') options.build = true
    else if (argument === '--help') {
      console.log(
        `Usage: bun scripts/m2-benchmark.mjs --candidate <id> [options]\n\nOptions:\n  --config <path>      M2 manifest\n  --candidate <id>     Candidate to measure (repeatable)\n  --output <path>      Evidence JSON path\n  --build              Capture clean and incremental build samples\n`
      )
      process.exit(0)
    } else throw new Error(`Unknown argument: ${argument}`)
  }
  if (options.candidates.size === 0) throw new Error('Select at least one --candidate')
  if (!options.output) throw new Error('--output is required')
  return options
}

async function waitForServer(url, child) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Server exited before ${url} became ready`)
    try {
      const response = await fetch(url)
      if (response.status < 400) return
    } catch {
      // The production server is still starting.
    }
    await delay(100)
  }
  throw new Error(`Timed out waiting for ${url}`)
}

async function stopServer(child) {
  const closed =
    child.exitCode === null
      ? new Promise((resolveExit) => child.once('close', resolveExit))
      : Promise.resolve()
  signalServer(child, 'SIGTERM')
  await Promise.race([closed, delay(500)])
  if (child.exitCode === null) signalServer(child, 'SIGKILL')
}

function signalServer(child, signal) {
  try {
    if (process.platform !== 'win32' && child.pid) process.kill(-child.pid, signal)
    else child.kill(signal)
  } catch (error) {
    if (error?.code !== 'ESRCH') throw error
  }
}

function startServer(control) {
  const child = spawn(control.commands.start[0], control.commands.start.slice(1), {
    cwd: resolve(control.path),
    env: {
      ...process.env,
      PORT: String(control.port),
      HOST: '127.0.0.1',
      ...control.environment,
    },
    detached: process.platform !== 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let logs = ''
  child.stdout.on('data', (chunk) => {
    logs += String(chunk)
  })
  child.stderr.on('data', (chunk) => {
    logs += String(chunk)
  })
  return { child, logs: () => logs }
}

async function captureColdStarts(control, runCount) {
  const samples = []
  const readyUrl = `http://127.0.0.1:${control.port}${control.readyPath ?? '/'}`
  for (let sample = 0; sample < runCount; sample += 1) {
    console.log(`[${control.id ?? control.app}:cold-start] sample ${sample + 1}/${runCount}`)
    const startedAt = performance.now()
    const server = startServer(control)
    try {
      await waitForServer(readyUrl, server.child)
      samples.push(performance.now() - startedAt)
    } catch (error) {
      throw new Error(
        `${error instanceof Error ? error.message : error}\n${server.logs().slice(-4_000)}`
      )
    } finally {
      await stopServer(server.child)
    }
  }
  return {
    target: control.id ?? control.app,
    readyPath: control.readyPath ?? '/',
    samples,
    summary: summarizeSamples(samples),
  }
}

async function directoryBytes(path, predicate = () => true) {
  try {
    const details = await stat(path)
    if (details.isFile()) return predicate(path) ? details.size : 0
    const children = await readdir(path)
    return (
      await Promise.all(children.map((child) => directoryBytes(resolve(path, child), predicate)))
    ).reduce((total, bytes) => total + bytes, 0)
  } catch (error) {
    if (error?.code === 'ENOENT') return 0
    throw error
  }
}

async function timedFetchPair(url) {
  const cacheUrl = new URL(url)
  cacheUrl.searchParams.set('__m2_cache_sample', `${Date.now()}-${Math.random()}`)
  const run = async () => {
    const startedAt = performance.now()
    const response = await fetch(cacheUrl, { headers: { cookie: 'm2-session=fixture' } })
    const responseHeadersMs = performance.now() - startedAt
    await response.arrayBuffer()
    const durationMs = performance.now() - startedAt
    return {
      responseHeadersMs,
      durationMs,
      streamGapMs: durationMs - responseHeadersMs,
      status: response.status,
      cacheControl: response.headers.get('cache-control'),
      age: response.headers.get('age'),
      cacheStatus:
        response.headers.get('x-vercel-cache') ?? response.headers.get('cf-cache-status'),
    }
  }
  return { cold: await run(), warm: await run() }
}

async function captureBuild(candidate, runCount) {
  const cwd = resolve(candidate.path)
  const clean = []
  const incremental = []
  for (let sample = 0; sample < runCount; sample += 1) {
    for (const path of candidate.cleanPaths)
      await rm(resolve(cwd, path), { recursive: true, force: true })
    const cleanResult = await runCommand(
      candidate.commands.build[0],
      candidate.commands.build.slice(1),
      { cwd }
    )
    if (cleanResult.exitCode !== 0)
      throw new Error(`${candidate.id} clean build failed: ${cleanResult.stderr}`)
    clean.push(cleanResult.durationMs)
    const incrementalResult = await runCommand(
      candidate.commands.build[0],
      candidate.commands.build.slice(1),
      { cwd }
    )
    if (incrementalResult.exitCode !== 0)
      throw new Error(`${candidate.id} incremental build failed: ${incrementalResult.stderr}`)
    incremental.push(incrementalResult.durationMs)
  }
  const outputBytes = (
    await Promise.all(candidate.outputPaths.map((path) => directoryBytes(resolve(cwd, path))))
  ).reduce((total, bytes) => total + bytes, 0)
  const clientJavaScriptBytes = (
    await Promise.all(
      candidate.clientAssetPaths.map((path) =>
        directoryBytes(resolve(cwd, path), (file) => ['.js', '.mjs'].includes(extname(file)))
      )
    )
  ).reduce((total, bytes) => total + bytes, 0)
  return {
    candidate: candidate.id,
    clean: { samples: clean, summary: summarizeSamples(clean) },
    incremental: { samples: incremental, summary: summarizeSamples(incremental) },
    outputBytes,
    clientJavaScriptBytes,
  }
}

async function captureCandidate(candidate, config, chromeExecutable) {
  const baseUrl = `http://127.0.0.1:${candidate.port}`
  const server = startServer(candidate)
  try {
    await waitForServer(baseUrl, server.child)
    const measurements = []
    for (const fixture of candidate.routes) {
      const samples = []
      const cold = []
      const warm = []
      for (let sample = 0; sample < config.runCount; sample += 1) {
        console.log(`[${candidate.id}:${fixture.fixture}] sample ${sample + 1}/${config.runCount}`)
        const cache = await timedFetchPair(`${baseUrl}${fixture.path}`)
        cold.push(cache.cold)
        warm.push(cache.warm)
        samples.push({
          ...(await measureRoute({
            route: {
              id: `${candidate.id}-${fixture.fixture}`,
              app: candidate.id,
              url: `${baseUrl}${fixture.path}`,
              environment: 'local-production',
              priority: 'P0',
              viewport: config.profile.viewport,
              interaction: { selector: fixture.interaction },
              navigation: fixture.navigation,
              cookies: fixture.cookies,
            },
            chromeExecutable,
            settleMs: config.settleMs,
          })),
          serverResponseMs: cache.cold.responseHeadersMs,
          responseCompleteMs: cache.cold.durationMs,
          streamGapMs: cache.cold.streamGapMs,
        })
      }
      const summaryMetrics = [
        ...REQUIRED_ROUTE_METRICS,
        'serverResponseMs',
        'responseCompleteMs',
        'streamGapMs',
        'clientNavigationMs',
      ]
      measurements.push({
        candidate: candidate.id,
        framework: candidate.framework,
        version: candidate.version,
        fixture: fixture.fixture,
        path: fixture.path,
        summary: Object.fromEntries(
          summaryMetrics.map((metric) => [
            metric,
            summarizeSamples(samples.map((entry) => entry[metric])),
          ])
        ),
        cache: {
          cold: {
            durationMs: summarizeSamples(cold.map(({ durationMs }) => durationMs)),
            responses: cold,
          },
          warm: {
            durationMs: summarizeSamples(warm.map(({ durationMs }) => durationMs)),
            responses: warm,
          },
        },
        samples,
      })
    }
    return measurements
  } finally {
    await stopServer(server.child)
    if (server.child.exitCode && server.child.exitCode !== 143)
      console.error(server.logs().slice(-4_000))
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const config = JSON.parse(await readFile(options.config, 'utf8'))
  const candidates = config.candidates.filter(({ id }) => options.candidates.has(id))
  if (candidates.length !== options.candidates.size)
    throw new Error('One or more candidate IDs are unknown')
  const chromeExecutable =
    process.env.CHROME_EXECUTABLE ??
    Bun.which('google-chrome') ??
    Bun.which('chromium') ??
    DEFAULT_CHROME
  const builds = []
  if (options.build) {
    for (const candidate of candidates) builds.push(await captureBuild(candidate, config.runCount))
  }
  const coldStarts = []
  for (const candidate of candidates)
    coldStarts.push(await captureColdStarts(candidate, config.runCount))
  const applicationColdStarts = []
  if (candidates.some(({ id }) => id === 'next-control')) {
    for (const application of config.applicationControls)
      applicationColdStarts.push(await captureColdStarts(application, config.runCount))
  }
  const measurements = []
  for (const candidate of candidates)
    measurements.push(...(await captureCandidate(candidate, config, chromeExecutable)))
  const report = {
    schemaVersion: 1,
    profileId: config.profileId,
    generatedAt: new Date().toISOString(),
    gitRevision: Bun.spawnSync(['git', 'rev-parse', 'HEAD']).stdout.toString().trim(),
    runCount: config.runCount,
    profile: config.profile,
    candidates: candidates.map(({ id, framework, version }) => ({ id, framework, version })),
    measurements,
    builds,
    coldStarts,
    applicationColdStarts,
  }
  await writeFile(options.output, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`Wrote ${options.output}`)
}

if (import.meta.main)
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : error)
    process.exit(1)
  })
