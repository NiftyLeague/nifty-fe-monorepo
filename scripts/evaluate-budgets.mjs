#!/usr/bin/env node
/**
 * Evaluates a benchmark result file against a baseline under the budget table in
 * `docs/architecture/m0-baseline-and-decision-gates.md`.
 *
 * Usage: bun scripts/evaluate-budgets.mjs --baseline <results.json> --current <results.json>
 *
 * Verdicts: PASS (within budget), REGRESSION (violates a decision rule), or
 * EXCEPTION (violates the numeric budget with a recorded, attributed exception —
 * exceptions live in `docs/architecture/m5-performance-budgets.md`, never in code).
 * Exit code is 0 unless --strict, so M5.2 can publish while #1886 wires the gate.
 */
import { readFile } from 'node:fs/promises'

const args = process.argv.slice(2)
const read = (flag) => {
  const value = args[args.indexOf(flag) + 1]
  if (!value) throw new Error(`Missing value for ${flag}`)
  return value
}
if (!args.includes('--baseline') || !args.includes('--current')) {
  console.error(
    'Usage: bun scripts/evaluate-budgets.mjs --baseline <results.json> --current <results.json> [--strict]'
  )
  process.exit(2)
}
const strict = args.includes('--strict')

const median = (summary) => summary?.median
const max = (summary) => summary?.maximum
const pct = (before, after) => (before ? ((after - before) / before) * 100 : null)

// Route priority drives the P0 vs P1/P2 columns of the budget table. Build
// benchmarks inherit the priority of the app's primary route.
const priorityOf = (config, appId) =>
  config.routes.find((route) => route.app === appId)?.priority ?? 'P1'

/** Metric verdicts per route. Each check returns null (pass) or a failure string. */
function checkRoute(baselineRoute, currentRoute, priority, exceptions) {
  const id = baselineRoute.route.id
  const base = baselineRoute.summary
  const cur = currentRoute.summary
  const p0 = priority === 'P0'
  const findings = []
  const exceptionsForRoute = exceptions.filter((entry) => entry.route === id)

  const budgetCheck = (name, budgetMedian, budgetMax, currentMedian, currentMax) => {
    if (currentMedian === null || currentMedian === undefined) return
    if (currentMedian > budgetMedian)
      findings.push(`${name}: median ${Math.round(currentMedian)} > ${budgetMedian} ms budget`)
    if (budgetMax && currentMax > budgetMax)
      findings.push(`${name}: worst sample ${Math.round(currentMax)} > ${budgetMax} ms ceiling`)
  }
  const growthCheck = (label, before, after, limitPct) => {
    const change = pct(before, after)
    if (change === null) return
    if (change > limitPct)
      findings.push(
        `${label}: ${Math.round(before)} → ${Math.round(after)} (+${change.toFixed(1)}% > +${limitPct}%)`
      )
  }

  // LCP
  budgetCheck('LCP', p0 ? 2500 : 3000, p0 ? 4000 : null, median(cur.lcpMs), max(cur.lcpMs))
  const lcpDelta = median(cur.lcpMs) - median(base.lcpMs)
  if (lcpDelta > 0 && lcpDelta > 250 && pct(median(base.lcpMs), median(cur.lcpMs)) > 10)
    findings.push(
      `LCP median regression ${Math.round(lcpDelta)} ms exceeds the >10% and >250 ms rule`
    )

  // INP (synthetic; a null on either side means the action produced no entries —
  // nothing to compare, never a zero)
  if (cur.inpMs !== null && median(cur.inpMs) > (p0 ? 200 : 300))
    findings.push(`INP: median ${Math.round(cur.inpMs)} > ${p0 ? 200 : 300} ms budget`)
  if (cur.inpMs !== null && base.inpMs !== null) {
    const inpDelta = median(cur.inpMs) - median(base.inpMs)
    if (inpDelta > 20 && pct(median(base.inpMs), median(cur.inpMs)) > 10) {
      const exception = exceptionsForRoute.find((entry) => entry.metric === 'INP')
      if (exception)
        findings.push(
          `EXCEPTION INP: ${Math.round(median(base.inpMs))} → ${Math.round(median(cur.inpMs))} ms (+${Math.round(inpDelta)}) — ${exception.reason}`
        )
      else
        findings.push(
          `INP regression: +${Math.round(inpDelta)} ms exceeds the >10% and >20 ms rule`
        )
    }
  }

  // CLS
  if (median(cur.cls) > (p0 ? 0.1 : 0.15))
    findings.push(`CLS: median ${median(cur.cls)} over the ${p0 ? 0.1 : 0.15} ceiling`)
  if (median(cur.cls) - median(base.cls) > 0.02)
    findings.push(`CLS grew ${(median(cur.cls) - median(base.cls)).toFixed(4)} (> 0.02 rule)`)

  // TTFB
  if (median(cur.ttfbMs) > (p0 ? 800 : 1000))
    findings.push(`TTFB: median ${Math.round(median(cur.ttfbMs))} > ${p0 ? 800 : 1000} ms budget`)

  // Transfer / JS / CSS / requests / memory — growth budgets with an exception escape hatch.
  const growthMetrics = [
    ['transfer', 'totalTransferBytes', p0 ? 10 : 15],
    ['JS', 'javascriptBytes', p0 ? 10 : 15],
    ['CSS', 'cssBytes', p0 ? 10 : 15],
    ['requests', 'requestCount', p0 ? 10 : 15],
    ['memory', 'memoryBytes', p0 ? 15 : 20],
  ]
  for (const [label, key, limitPct] of growthMetrics) {
    const before = median(base[key])
    const after = median(cur[key])
    const change = pct(before, after)
    if (change === null || change <= limitPct) continue
    const exception = exceptionsForRoute.find((entry) => entry.metric === label)
    if (exception) {
      findings.push(
        `EXCEPTION ${label}: ${Math.round(before)} → ${Math.round(after)} (+${change.toFixed(1)}%) — ${exception.reason}`
      )
    } else {
      findings.push(
        `${label}: +${change.toFixed(1)}% over the +${limitPct}% budget (no exception recorded)`
      )
    }
  }

  return { id, findings }
}

function checkBuilds(baselineBuilds, currentBuilds, config, buildExceptions) {
  const findings = []
  for (const current of currentBuilds) {
    const before = baselineBuilds.find((entry) => entry.app === current.app)
    if (!before) continue
    const limit = priorityOf(config, current.app) === 'P0' ? 10 : 15
    for (const kind of ['clean', 'incremental']) {
      const key = `${kind}DurationMs`
      const beforeMs = median(before[key])
      const afterMs = median(current[key])
      const change = pct(beforeMs, afterMs)
      if (change <= limit) continue
      const exception = buildExceptions.find(
        (entry) => entry.app === current.app && entry.kind === kind
      )
      if (exception)
        findings.push(
          `EXCEPTION build ${kind} (${current.app}): ${Math.round(beforeMs)} → ${Math.round(afterMs)} ms (+${change.toFixed(1)}%) — ${exception.reason}`
        )
      else
        findings.push(
          `build ${kind} (${current.app}): ${Math.round(beforeMs)} → ${Math.round(afterMs)} ms (+${change.toFixed(1)}% > +${limit}%)`
        )
    }
  }
  return findings
}

const load = async (path) => JSON.parse(await readFile(path, 'utf8'))
const baseline = await load(read('--baseline'))
const buildBaseline = args.includes('--build-baseline')
  ? await load(read('--build-baseline'))
  : baseline
const current = await load(read('--current'))
const config = JSON.parse(
  await readFile(new URL('../benchmarks/m0-routes.json', import.meta.url), 'utf8')
)

// Recorded exceptions: numeric budget breaches with an owner and a bounded reason.
// Anything here must also appear in docs/architecture/m5-performance-budgets.md.
const exceptions = [
  {
    route: 'web-home',
    metric: 'transfer',
    reason:
      'third-party analytics/monitoring injected by the GTM container (GA4, Clarity) — owned by the analytics decision in #1903, not application code',
  },
  {
    route: 'web-home',
    metric: 'JS',
    reason: 'same GTM container payloads as transfer; first-party JS is ~132 KB (#1837 breakdown)',
  },
  {
    route: 'web-home',
    metric: 'requests',
    reason: 'GTM container tag requests; consolidation is the #1903 decision',
  },
  {
    route: 'app-degens',
    metric: 'requests',
    reason:
      'TanStack chunk granularity (63 → 127 requests while bytes fell) — bounded by the M5.8 audit #1885',
  },
  {
    route: 'smashers-home',
    metric: 'JS',
    reason:
      'Astro island runtime and hydration chunks vs the Next bundle — per-chunk audit bounded by M5.6 #1883',
  },
  {
    route: 'smashers-home',
    metric: 'INP',
    reason:
      'the synthetic click lands on a page whose hero video decode added ~2 frames of main-thread contention — 40 ms is 5× under the 200 ms budget and the action, target, and profile are identical to baseline',
  },
  {
    route: 'smashers-home',
    metric: 'requests',
    reason:
      '#1907 video delivery: posters and logos now load through the Vercel image optimizer and settle-window tag beacons join the count — transfer fell 79% and LCP 600 → 444 ms in the same run, so nothing added is critical-path',
  },
  {
    route: 'smashers-home',
    metric: 'memory',
    reason:
      'island hydration retains ~3.5 MB more live JS heap than the Next-era server-rendered page (JSHeapUsedSize sd 0.1 — consistent, not noise); per-island heap audit bounded by M5.6 #1883',
  },
  {
    route: 'web-home',
    metric: 'memory',
    reason:
      'the same GTM/GA4/Clarity payloads as the transfer/JS exceptions retain heap; owner #1903',
  },
]

// Build exceptions must also appear in docs/architecture/m5-performance-budgets.md.
const buildExceptions = [
  {
    app: 'api',
    kind: 'clean',
    reason:
      'the api bundle gained the traced config import and marketplace metadata; +0.6 s absolute on a ~2 s build with consistent samples',
  },
  {
    app: 'api',
    kind: 'incremental',
    reason: 'same bundle growth as the clean samples; +0.6 s absolute',
  },
  {
    app: 'docs',
    kind: 'clean',
    reason:
      'Docusaurus → Starlight: the baseline Docusaurus incremental was slower than its clean (cache pathology); Astro costs +1.5 s absolute for 27 MDX pages plus Starlight integrations',
  },
  {
    app: 'smashers',
    kind: 'incremental',
    reason:
      'Astro builds are not incremental — the harness second sample is a second full build (13.8 s ≈ its 11.5 s clean), unlike the Next-era true incremental cache; framework property',
  },
]

let regressions = 0
let exceptionsHit = 0
for (const currentRoute of current.routes) {
  const baselineRoute = baseline.routes.find((r) => r.route.id === currentRoute.route.id)
  if (!baselineRoute) continue
  const priority = priorityOf(config, currentRoute.route.app)
  const { id, findings } = checkRoute(baselineRoute, currentRoute, priority, exceptions)
  if (findings.length === 0) {
    console.log(`PASS  ${id}`)
    continue
  }
  console.log(`\n${id} (priority ${priority})`)
  for (const finding of findings) {
    console.log(`  ${finding.startsWith('EXCEPTION') ? 'EXCEPT' : 'REGRESS'}  ${finding}`)
    if (finding.startsWith('EXCEPTION')) exceptionsHit += 1
    else regressions += 1
  }
}

const buildFindings = checkBuilds(
  buildBaseline.builds ?? [],
  current.builds ?? [],
  config,
  buildExceptions
)
if (buildFindings.length) {
  console.log('\nbuild benchmarks')
  for (const finding of buildFindings) {
    console.log(`  ${finding.startsWith('EXCEPTION') ? 'EXCEPT' : 'REGRESS'}  ${finding}`)
    if (finding.startsWith('EXCEPTION')) exceptionsHit += 1
    else regressions += 1
  }
} else if (current.builds?.length) {
  console.log('\nPASS  build benchmarks (clean + incremental within budget)')
}

console.log(
  `\n${regressions} regression(s), ${exceptionsHit} recorded exception(s)` +
    (strict && regressions > 0 ? ' — strict mode: exiting 1' : '')
)
if (strict && regressions > 0) process.exit(1)
