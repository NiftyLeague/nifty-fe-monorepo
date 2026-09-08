#!/usr/bin/env bun

import { spawn } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { createServer } from 'node:net'

export const REQUIRED_ROUTE_METRICS = [
  'lcpMs',
  'inpMs',
  'cls',
  'ttfbMs',
  'totalTransferBytes',
  'javascriptBytes',
  'cssBytes',
  'requestCount',
  'memoryBytes',
]

const DEFAULT_CONFIG = 'benchmarks/m0-routes.json'
const DEFAULT_RUNS = 5
const DEFAULT_SETTLE_MS = 2_000
const CHROME_EXECUTABLES = [
  process.env.CHROME_EXECUTABLE,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'google-chrome',
  'chromium',
].filter(Boolean)

export function summarizeSamples(samples) {
  const values = samples.filter((value) => Number.isFinite(value)).toSorted((a, b) => a - b)
  const count = values.length
  if (count === 0) return null

  const percentile = (percent) => {
    const position = (count - 1) * percent
    const lower = Math.floor(position)
    const upper = Math.ceil(position)
    return values[lower] + (values[upper] - values[lower]) * (position - lower)
  }
  const mean = values.reduce((total, value) => total + value, 0) / count
  const variance =
    count > 1 ? values.reduce((total, value) => total + (value - mean) ** 2, 0) / (count - 1) : 0

  return {
    count,
    median: percentile(0.5),
    p75: percentile(0.75),
    minimum: values[0],
    maximum: values.at(-1),
    standardDeviation: Math.sqrt(variance),
    confidence: count >= 5 ? 'moderate: repeated synthetic runs' : 'low: fewer than 5 runs',
  }
}

export function validateBenchmarkConfig(config) {
  const errors = []
  if (!config || typeof config !== 'object') return ['config must be an object']
  if (!Array.isArray(config.routes) || config.routes.length === 0) {
    errors.push('config.routes must contain at least one route')
    return errors
  }

  const ids = new Set()
  for (const route of config.routes) {
    if (!route || typeof route !== 'object') {
      errors.push('every route must be an object')
      continue
    }
    for (const field of ['id', 'app', 'url', 'environment', 'priority']) {
      if (typeof route[field] !== 'string' || route[field].length === 0) {
        errors.push(`route is missing ${field}`)
      }
    }
    if (ids.has(route.id)) errors.push(`route id is duplicated: ${route.id}`)
    ids.add(route.id)
  }
  return errors
}

function parseArgs(args) {
  const options = {
    config: DEFAULT_CONFIG,
    output: undefined,
    routeIds: new Set(),
    buildApps: new Set(),
    runs: undefined,
    includeLocal: false,
    build: false,
    dryRun: false,
  }
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    const value = args[index + 1]
    if (argument === '--config') {
      options.config = value
      index += 1
    } else if (argument === '--output') {
      options.output = value
      index += 1
    } else if (argument === '--route') {
      options.routeIds.add(value)
      index += 1
    } else if (argument === '--runs') {
      options.runs = Number(value)
      index += 1
    } else if (argument === '--include-local') {
      options.includeLocal = true
    } else if (argument === '--build') {
      options.build = true
    } else if (argument === '--build-app') {
      options.buildApps.add(value)
      index += 1
    } else if (argument === '--dry-run') {
      options.dryRun = true
    } else if (argument === '--help') {
      console.log(`Usage: bun scripts/m0-benchmark.mjs [options]

Options:
  --config <path>     Route manifest (default: ${DEFAULT_CONFIG})
  --output <path>     JSON evidence file
  --route <id>        Measure only this route (repeatable)
  --runs <count>      Override route sample count (default: manifest or ${DEFAULT_RUNS})
  --include-local     Include routes explicitly marked local-only
  --build             Also capture clean and incremental build timings
  --build-app <name>  Limit build timing to one app (repeatable)
  --dry-run           Validate and print the planned measurements
`)
      process.exit(0)
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }
  if (options.runs !== undefined && (!Number.isInteger(options.runs) || options.runs < 1)) {
    throw new Error('--runs must be a positive integer')
  }
  return options
}

const delay = (milliseconds) =>
  new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds))

async function availablePort() {
  const server = createServer()
  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen)
    server.listen(0, '127.0.0.1', resolveListen)
  })
  const address = server.address()
  await new Promise((resolveClose, rejectClose) =>
    server.close((error) => (error ? rejectClose(error) : resolveClose()))
  )
  if (!address || typeof address === 'string')
    throw new Error('Unable to reserve a Chrome debugging port')
  return address.port
}

async function chromeWebSocketUrl(port) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (response.ok) return (await response.json()).webSocketDebuggerUrl
    } catch {
      // Chrome is still starting.
    }
    await delay(100)
  }
  throw new Error('Chrome did not expose its DevTools endpoint')
}

async function connectCdp(url) {
  const socket = new WebSocket(url)
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener('open', resolveOpen, { once: true })
    socket.addEventListener('error', rejectOpen, { once: true })
  })

  let sequence = 0
  const pending = new Map()
  const listeners = new Set()
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(String(data))
    if (message.id) {
      const request = pending.get(message.id)
      if (!request) return
      pending.delete(message.id)
      if (message.error)
        request.reject(new Error(`${message.error.message} (${message.error.code})`))
      else request.resolve(message.result)
      return
    }
    for (const listener of listeners) listener(message)
  })

  return {
    command(method, params = {}, sessionId) {
      const id = ++sequence
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
      return new Promise((resolveCommand, rejectCommand) =>
        pending.set(id, { resolve: resolveCommand, reject: rejectCommand })
      )
    },
    on(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    close() {
      socket.close()
    },
  }
}

async function waitForEvent(cdp, method, sessionId, timeoutMs) {
  return new Promise((resolveEvent) => {
    const timeout = setTimeout(() => {
      stop()
      resolveEvent(null)
    }, timeoutMs)
    const stop = cdp.on((event) => {
      if (event.method === method && event.sessionId === sessionId) {
        clearTimeout(timeout)
        stop()
        resolveEvent(event)
      }
    })
  })
}

const observerSource = `
  (() => {
    const result = { lcpMs: null, cls: 0, inpMs: null, unsupported: [] };
    globalThis.__m0Vitals = result;
    const observe = (type, callback, options = {}) => {
      try { new PerformanceObserver(callback).observe({ type, buffered: true, ...options }); }
      catch { result.unsupported.push(type); }
    };
    observe('largest-contentful-paint', (list) => {
      const entries = list.getEntries();
      const entry = entries[entries.length - 1];
      if (entry) result.lcpMs = entry.startTime;
    });
    observe('layout-shift', (list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) result.cls += entry.value;
    });
    observe('event', (list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > (result.inpMs ?? 0)) result.inpMs = entry.duration;
      }
    }, { durationThreshold: 16 });
  })();
`

export async function measureRoute({ route, chromeExecutable, settleMs }) {
  const profile = await mkdtemp(resolve(tmpdir(), 'nifty-m0-chrome-'))
  const port = await availablePort()
  const chrome = spawn(
    chromeExecutable,
    [
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-component-update',
      '--disable-sync',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  )

  let cdp
  try {
    cdp = await connectCdp(await chromeWebSocketUrl(port))
    const target = await cdp.command('Target.createTarget', { url: 'about:blank' })
    const attached = await cdp.command('Target.attachToTarget', {
      targetId: target.targetId,
      flatten: true,
    })
    const sessionId = attached.sessionId
    const command = (method, params) => cdp.command(method, params, sessionId)
    const resources = new Map()
    const removeNetworkListener = cdp.on((event) => {
      if (event.sessionId !== sessionId) return
      if (event.method === 'Network.responseReceived') {
        resources.set(event.params.requestId, {
          type: event.params.type,
          url: event.params.response.url,
          transferBytes: 0,
        })
      }
      if (event.method === 'Network.loadingFinished' && resources.has(event.params.requestId)) {
        resources.get(event.params.requestId).transferBytes = event.params.encodedDataLength
      }
    })

    await command('Page.enable')
    await command('Network.enable')
    await command('Runtime.enable')
    for (const cookie of route.cookies ?? []) {
      await command('Network.setCookie', {
        name: cookie.name,
        value: cookie.value,
        url: route.url,
      })
    }
    await command('Emulation.setDeviceMetricsOverride', {
      width: route.viewport?.width ?? 1365,
      height: route.viewport?.height ?? 768,
      deviceScaleFactor: route.viewport?.deviceScaleFactor ?? 1,
      mobile: false,
    })
    await command('Network.setCacheDisabled', { cacheDisabled: true })
    await command('Page.addScriptToEvaluateOnNewDocument', { source: observerSource })

    const loaded = waitForEvent(cdp, 'Page.loadEventFired', sessionId, route.timeoutMs ?? 30_000)
    await command('Page.navigate', { url: route.url })
    const loadEvent = await loaded
    await delay(settleMs)

    const interaction = await command('Runtime.evaluate', {
      expression: `(() => {
        const element = document.querySelector(${JSON.stringify(route.interaction?.selector ?? 'body')}) || document.body;
        const rect = element.getBoundingClientRect();
        return { x: Math.max(1, Math.round(rect.left + Math.min(rect.width / 2, 20))), y: Math.max(1, Math.round(rect.top + Math.min(rect.height / 2, 20))) };
      })()`,
      returnByValue: true,
    })
    const point = interaction.result.value
    await command('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: point.x,
      y: point.y,
      button: 'left',
      clickCount: 1,
    })
    await command('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: point.x,
      y: point.y,
      button: 'left',
      clickCount: 1,
    })
    await delay(500)

    const browserMetrics = await command('Runtime.evaluate', {
      expression: `Promise.resolve().then(async () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const vitals = globalThis.__m0Vitals ?? {};
        let memoryBytes = performance.memory?.usedJSHeapSize ?? null;
        try { memoryBytes = (await performance.measureUserAgentSpecificMemory()).bytes; } catch {}
        return { ...vitals, ttfbMs: navigation ? navigation.responseStart : null, memoryBytes };
      })`,
      awaitPromise: true,
      returnByValue: true,
    })
    let clientNavigationMs = null
    let navigationMode = null
    if (route.navigation?.selector) {
      await command('Runtime.evaluate', {
        expression: 'globalThis.__m2NavigationContext = true',
      })
      const navigationStartedAt = performance.now()
      await command('Runtime.evaluate', {
        expression: `document.querySelector(${JSON.stringify(route.navigation.selector)})?.click()`,
      })
      const navigationTimeoutAt = performance.now() + (route.navigation.timeoutMs ?? 10_000)
      while (performance.now() < navigationTimeoutAt) {
        try {
          const state = await command('Runtime.evaluate', {
            expression: `({
              path: location.pathname,
              ready: Boolean(document.querySelector(${JSON.stringify(route.navigation.readySelector ?? 'main')})),
              retainedContext: globalThis.__m2NavigationContext === true,
            })`,
            returnByValue: true,
          })
          if (state.result.value.path === route.navigation.targetPath && state.result.value.ready) {
            clientNavigationMs = performance.now() - navigationStartedAt
            navigationMode = state.result.value.retainedContext ? 'client' : 'document'
            break
          }
        } catch {
          // A full document navigation briefly destroys the execution context.
        }
        await delay(25)
      }
      if (clientNavigationMs === null) {
        throw new Error(`Client navigation did not reach ${route.navigation.targetPath}`)
      }
    }
    removeNetworkListener()

    const network = [...resources.values()]
    const transfer = (types) =>
      network
        .filter((resource) => types.includes(resource.type))
        .reduce((total, resource) => total + resource.transferBytes, 0)
    return {
      capturedAt: new Date().toISOString(),
      url: route.url,
      loaded: Boolean(loadEvent),
      ...browserMetrics.result.value,
      totalTransferBytes: transfer([
        'Document',
        'Stylesheet',
        'Script',
        'Image',
        'Media',
        'Font',
        'XHR',
        'Fetch',
        'Other',
      ]),
      javascriptBytes: transfer(['Script']),
      cssBytes: transfer(['Stylesheet']),
      requestCount: network.length,
      clientNavigationMs,
      navigationMode,
      measurementNotes: {
        inp: 'Synthetic click on the configured selector; compare only against the same action.',
        memory: 'Chromium heap or measureUserAgentSpecificMemory when the browser permits it.',
        unsupported: browserMetrics.result.value.unsupported,
      },
    }
  } finally {
    cdp?.close()
    chrome.kill('SIGTERM')
    await rm(profile, { recursive: true, force: true })
  }
}

function summarizeRoute(route, samples) {
  const summary = Object.fromEntries(
    REQUIRED_ROUTE_METRICS.map((metric) => [
      metric,
      summarizeSamples(samples.map((sample) => sample[metric])),
    ])
  )
  return { route, summary, samples }
}

export async function runCommand(command, args, options = {}) {
  const startedAt = performance.now()
  const child = spawn(command, args, { stdio: 'pipe', cwd: options.cwd })
  let stdout = ''
  let stderr = ''
  child.stdout.on('data', (chunk) => {
    stdout += String(chunk)
  })
  child.stderr.on('data', (chunk) => {
    stderr += String(chunk)
  })
  const exitCode = await new Promise((resolveExit) => child.on('close', resolveExit))
  return {
    command: [command, ...args],
    durationMs: performance.now() - startedAt,
    exitCode,
    stdout: stdout.slice(-4_000),
    stderr: stderr.slice(-4_000),
  }
}

async function runBuildBenchmarks(config, buildApps) {
  const results = []
  const buildRunCount = config.buildRunCount ?? 3
  for (const build of config.builds ?? []) {
    if (buildApps.size > 0 && !buildApps.has(build.app)) continue
    const clean = []
    const incremental = []
    for (let sample = 0; sample < buildRunCount; sample += 1) {
      for (const cleanPath of build.cleanPaths ?? [])
        await rm(resolve(cleanPath), { recursive: true, force: true })
      clean.push(await runCommand(build.command[0], build.command.slice(1)))
      incremental.push(await runCommand(build.command[0], build.command.slice(1)))
    }
    results.push({
      app: build.app,
      clean,
      incremental,
      cleanDurationMs: summarizeSamples(clean.map((result) => result.durationMs)),
      incrementalDurationMs: summarizeSamples(incremental.map((result) => result.durationMs)),
    })
  }
  return results
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const config = JSON.parse(await readFile(options.config, 'utf8'))
  const errors = validateBenchmarkConfig(config)
  if (errors.length > 0) throw new Error(`Invalid benchmark config:\n- ${errors.join('\n- ')}`)

  const selected = config.routes.filter(
    (route) =>
      (options.routeIds.size === 0 || options.routeIds.has(route.id)) &&
      (options.includeLocal || route.environment !== 'local-only')
  )
  if (selected.length === 0) throw new Error('No routes matched the selected options')
  if (options.dryRun) {
    console.log(
      JSON.stringify(
        { config: options.config, routes: selected.map((route) => route.id), build: options.build },
        null,
        2
      )
    )
    return
  }

  const chromeExecutable = CHROME_EXECUTABLES[0]
  if (!chromeExecutable)
    throw new Error('Set CHROME_EXECUTABLE to a headless Chrome or Chromium binary')
  const runs = options.runs ?? config.runCount ?? DEFAULT_RUNS
  const results = []
  for (const route of selected) {
    const samples = []
    for (let sample = 0; sample < runs; sample += 1) {
      console.log(`[${route.id}] sample ${sample + 1}/${runs}`)
      samples.push(
        await measureRoute({
          route,
          chromeExecutable,
          settleMs: config.settleMs ?? DEFAULT_SETTLE_MS,
        })
      )
    }
    results.push(summarizeRoute(route, samples))
  }

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    gitRevision: Bun.spawnSync(['git', 'rev-parse', 'HEAD']).stdout.toString().trim(),
    profile: config.profile,
    runCount: runs,
    routes: results,
    builds: options.build ? await runBuildBenchmarks(config, options.buildApps) : [],
  }
  const output =
    options.output ?? `benchmarks/results/m0-${new Date().toISOString().slice(0, 10)}.json`
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`Wrote ${output}`)
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : error)
    process.exit(1)
  })
}
