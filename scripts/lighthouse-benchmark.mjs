#!/usr/bin/env node
/**
 * Unified Lighthouse benchmark for all four apps (#1886).
 *
 * Seed: `apps/app/scripts/benchmark.mjs` — devtools throttling (Lantern's
 * `simulate` models the network analytically and under-reports this repo by
 * ~15 points), medians of N runs, mobile and desktop form factors. That script
 * was the method the migration PRs validated after Lighthouse's default
 * misreported routes; every app now measures the same way.
 *
 * Usage:
 *   bun scripts/lighthouse-benchmark.mjs --app <name> --base-url <url> [--label <label>]
 *                                        [--runs <n>] [--forms mobile,desktop] [--routes a,b]
 *
 * Serving is per app and must match how production delivers the page
 * (compression, image negotiation, caching) or the numbers are not comparable:
 *   web      → `cd apps/web && bun run build && bunx wrangler dev --local --port 4337`
 *   app      → `cd apps/app && bun run build && bunx vite preview --port 4173`
 *   smashers → production SSR; local `astro dev/preview` lacks the Vercel image
 *              optimizer, so measure production and note the caveat
 *   docs     → `cd apps/docs && bun run build && bunx astro preview --port 4321`
 *
 * Results land in `benchmarks/results/` with the git revision, date, profile and
 * per-sample variance — same schema discipline as the m0/m1/m5 artifacts, which
 * are treated as immutable evidence.
 */
import { execSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const args = process.argv.slice(2)
const read = (flag) => {
  const value = args[args.indexOf(flag) + 1]
  if (!value) throw new Error(`Missing value for ${flag}`)
  return value
}
const has = (flag) => args.includes(flag)
const app = has('--app') ? read('--app') : undefined
const baseUrl = has('--base-url') ? read('--base-url') : undefined
const label = has('--label') ? read('--label') : 'manual'
const runs = has('--runs') ? Number(read('--runs')) : 3
const forms = (has('--forms') ? read('--forms') : 'mobile,desktop').split(',')
const onlyRoutes = has('--routes') ? new Set(read('--routes').split(',')) : undefined

if (!app || !baseUrl) {
  console.error(
    'usage: lighthouse-benchmark.mjs --app <name> --base-url <url> [--label l] [--runs n] [--forms f] [--routes r]'
  )
  process.exit(2)
}

const ROUTES = JSON.parse(
  readFileSync(resolve(here, 'lighthouse-routes', `${app}.json`), 'utf8')
).filter((route) => !onlyRoutes || onlyRoutes.has(route))

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']

const score = (result, id) => {
  const value = result.categories[id]?.score
  return value === null || value === undefined ? null : Math.round(value * 100)
}
const auditValue = (result, id) => result.audits[id]?.numericValue ?? null
const auditDisplay = (result, id) => result.audits[id]?.displayValue ?? null
const median = (values) => {
  const sorted = values.toSorted((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2)
}

/** Audits that failed, excluding the ones CDN/topology noise always fails. */
const failures = (result) => {
  const noisy = new Set(['uses-long-cache-ttl', 'network-server-latency', 'network-rtt'])
  return Object.values(result.audits)
    .filter((audit) => audit.score !== null && audit.score < 1 && !noisy.has(audit.id))
    .map((audit) => `${audit.id}${audit.displayValue ? ` (${audit.displayValue})` : ''}`)
}

const throttlingFor = (formFactor) =>
  formFactor === 'desktop'
    ? { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 }
    : { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 }

const configFor = (formFactor) => ({
  extends: 'lighthouse:default',
  settings: {
    formFactor,
    throttlingMethod: 'devtools',
    throttling: throttlingFor(formFactor),
    ...(formFactor === 'desktop'
      ? {
          screenEmulation: {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
          },
        }
      : {}),
  },
})

const gitRevision = execSync('git rev-parse HEAD', { cwd: root }).toString().trim()

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})

const results = []
const diagnostics = {}

try {
  for (const formFactor of forms) {
    const config = configFor(formFactor)
    for (const route of ROUTES) {
      const samples = []
      for (let run = 0; run < runs; run += 1) {
        const result = await lighthouse(
          `${baseUrl}${route}`,
          { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: CATEGORIES },
          config
        )
        samples.push(result.lhr)
      }

      const medians = {
        performance: median(samples.map((r) => score(r, 'performance'))),
        accessibility: median(samples.map((r) => score(r, 'accessibility'))),
        'best-practices': median(samples.map((r) => score(r, 'best-practices'))),
        seo: median(samples.map((r) => score(r, 'seo'))),
      }
      const metrics = (pick) => ({
        median: median(samples.map(pick)),
        minimum: Math.min(...samples.map(pick)),
        maximum: Math.max(...samples.map(pick)),
      })

      results.push({
        route,
        formFactor,
        scores: medians,
        lcpMs: metrics((r) => auditValue(r, 'largest-contentful-paint')),
        tbtMs: metrics((r) => auditValue(r, 'total-blocking-time')),
        cls: metrics((r) => auditValue(r, 'cumulative-layout-shift')),
        fcpMs: metrics((r) => auditValue(r, 'first-contentful-paint')),
        siMs: metrics((r) => auditValue(r, 'speed-index')),
        diagnostics: [...new Set(samples.flatMap(failures))],
      })

      const row = results.at(-1)
      console.log(
        `${formFactor.padEnd(7)} ${route.padEnd(28)} perf=${String(row.scores.performance).padStart(3)} a11y=${String(row.scores.accessibility).padStart(3)} bp=${String(row.scores['best-practices']).padStart(3)} seo=${String(row.scores.seo).padStart(3)}  LCP=${Math.round(row.lcpMs.median)}ms TBT=${Math.round(row.tbtMs.median)}ms CLS=${row.cls.median.toFixed(4)}`
      )
      diagnostics[`${formFactor} ${route}`] = row.diagnostics
    }
  }
} finally {
  await chrome.kill()
}

const stamp = new Date().toISOString().slice(0, 10)
mkdirSync(resolve(root, 'benchmarks/results'), { recursive: true })
const output = resolve(root, 'benchmarks/results', `lh-${app}-${label}-${stamp}.json`)
writeFileSync(
  output,
  `${JSON.stringify(
    {
      schemaVersion: 1,
      app,
      generatedAt: new Date().toISOString(),
      gitRevision,
      label,
      runs,
      profile: {
        browser: 'Chrome headless (chrome-launcher)',
        throttling:
          'devtools CDP (mobile: rtt 150ms / 1.6Mbps / 4x cpu; desktop: rtt 40ms / 10Mbps / 1x)',
        forms: forms,
        runsPerRoute: runs,
        confidence: 'synthetic lab data; not a substitute for field RUM',
      },
      results,
    },
    null,
    2
  )}\n`
)
console.log(`\nWrote ${output}`)
if (Object.keys(diagnostics).length) {
  console.log('Failed audits by route (see file for full list):')
  for (const [key, list] of Object.entries(diagnostics)) console.log(`  ${key}: ${list.join(', ')}`)
}
