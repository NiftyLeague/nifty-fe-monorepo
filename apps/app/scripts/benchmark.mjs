/**
 * Lighthouse benchmark for a running build.
 *
 * Usage: node scripts/benchmark.mjs <baseUrl> <label> [routesFile]
 *
 * Env:
 *   BENCH_RUNS      runs per route, median reported (default 3)
 *   BENCH_FORMS     comma-separated mobile,desktop (default both)
 *   BENCH_THROTTLE  devtools | simulate (default devtools)
 *
 * On throttling: Lighthouse's default `simulate` (Lantern) models the network
 * analytically and reports much worse numbers than the same build actually
 * achieves on a real connection — on this repo it under-reports a route by ~15
 * points. `devtools` applies Chrome's own CDP throttling and measures what a
 * user would experience, so it is the default here. Keep it consistent across
 * compared runs or the numbers are not comparable.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const [baseUrl, label, routesArg] = process.argv.slice(2)
if (!baseUrl || !label) {
  console.error('usage: node scripts/benchmark.mjs <baseUrl> <label> [routesFile]')
  process.exit(2)
}

const ROUTES = JSON.parse(
  readFileSync(routesArg ? resolve(routesArg) : resolve(here, 'benchmark-routes.json'), 'utf8')
)

const RUNS = Number(process.env.BENCH_RUNS ?? 3)
const FORMS = (process.env.BENCH_FORMS ?? 'mobile,desktop').split(',')
const THROTTLE = process.env.BENCH_THROTTLE ?? 'devtools'

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

/** Audits that failed, so a route can be traced back to its cause. */
const failures = (result) => {
  const noisy = new Set(['uses-long-cache-ttl', 'network-server-latency', 'network-rtt'])
  return Object.values(result.audits)
    .filter((a) => a.score !== null && a.score < 1 && !noisy.has(a.id))
    .map((a) => `${a.id}${a.displayValue ? ` (${a.displayValue})` : ''}`)
}

/**
 * Mobile is Lighthouse's default Moto G Power emulation. Desktop matches the
 * viewport Lighthouse uses for its own desktop preset.
 */
const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    throttlingMethod: THROTTLE,
    ...(THROTTLE === 'devtools'
      ? { throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 } }
      : {}),
  },
}

const desktopConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttlingMethod: THROTTLE,
    ...(THROTTLE === 'devtools'
      ? { throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } }
      : {}),
  },
}

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})

const results = {}
const diagnostics = {}

try {
  for (const formFactor of FORMS) {
    const config = formFactor === 'desktop' ? desktopConfig : mobileConfig

    for (const route of ROUTES) {
      const runs = []
      for (let run = 0; run < RUNS; run += 1) {
        const result = await lighthouse(
          `${baseUrl}${route}`,
          { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: CATEGORIES },
          config
        )
        runs.push(result.lhr)
      }

      const last = runs[runs.length - 1]
      results[`${formFactor}${route}`] = {
        route,
        formFactor,
        performance: median(runs.map((r) => score(r, 'performance'))),
        accessibility: median(runs.map((r) => score(r, 'accessibility'))),
        'best-practices': median(runs.map((r) => score(r, 'best-practices'))),
        seo: median(runs.map((r) => score(r, 'seo'))),
        fcp: auditDisplay(last, 'first-contentful-paint'),
        lcp: auditDisplay(last, 'largest-contentful-paint'),
        lcpMs: auditValue(last, 'largest-contentful-paint'),
        tbt: auditValue(last, 'total-blocking-time'),
        cls: auditValue(last, 'cumulative-layout-shift'),
        si: auditDisplay(last, 'speed-index'),
        tbtDisplay: auditDisplay(last, 'total-blocking-time'),
        clsDisplay: auditDisplay(last, 'cumulative-layout-shift'),
        transferKb: Math.round(
          (Object.values(last.audits)
            .filter((a) => a.details?.type === 'opportunity' || a.details?.overallSavingsBytes)
            .reduce((total, a) => total + (a.details?.overallSavingsBytes ?? 0), 0) || 0) / 1024
        ),
      }

      diagnostics[`${formFactor}${route}`] = [...new Set(runs.flatMap(failures))]

      const row = results[`${formFactor}${route}`]
      console.log(
        `${formFactor.padEnd(7)} ${route.padEnd(26)} perf=${String(row.performance).padStart(3)} a11y=${String(row.accessibility).padStart(3)} bp=${String(row['best-practices']).padStart(3)} seo=${String(row.seo).padStart(3)}  LCP=${String(row.lcp).padEnd(7)} TBT=${String(row.tbtDisplay).padEnd(8)} CLS=${row.clsDisplay}`
      )
    }
  }
} finally {
  await chrome.kill()
}

const outDir = resolve(root, 'artifacts/benchmarks')
mkdirSync(outDir, { recursive: true })
const payload = {
  label,
  baseUrl,
  runs: RUNS,
  throttle: THROTTLE,
  generatedAt: new Date().toISOString(),
  results,
  diagnostics,
}
const outFile = resolve(outDir, `${label}.json`)
writeFileSync(outFile, JSON.stringify(payload, null, 2))
console.log(`\nwrote ${outFile}`)

// Summarize the failing audits and how many routes each affects.
const grouped = new Map()
for (const list of Object.values(diagnostics)) {
  for (const entry of new Set(list.map((f) => f.split(' (')[0]))) {
    grouped.set(entry, (grouped.get(entry) ?? 0) + 1)
  }
}
if (grouped.size) {
  console.log('\nfailing audits (route count):')
  for (const [audit, count] of [...grouped].toSorted((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(2)}  ${audit}`)
  }
} else {
  console.log('\nno failing audits')
}
