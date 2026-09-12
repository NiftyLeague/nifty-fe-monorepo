import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

import { buildExceptions, evaluateBudgets, exceptions } from '../../scripts/evaluate-budgets.mjs'
import config from '../../benchmarks/m0-routes.json'

/**
 * The CI budget gate (`budget-gate.yml`) runs the strict evaluator; this test
 * exercises the same pure function with a seeded regression, which is how the
 * gate's failure path is demonstrated without waiting for a real perf regress.
 */
const route = (id, app, overrides = {}) => ({
  route: {
    id,
    app,
    url: `https://${app}.example.test${id}`,
    environment: 'production',
    priority: 'P0',
  },
  summary: {
    lcpMs: { median: 400, minimum: 380, maximum: 440 },
    inpMs: { median: 30, minimum: 28, maximum: 34 },
    cls: { median: 0.001, minimum: 0, maximum: 0.002 },
    ttfbMs: { median: 180, minimum: 170, maximum: 200 },
    totalTransferBytes: { median: 500_000 },
    javascriptBytes: { median: 400_000 },
    cssBytes: { median: 20_000 },
    requestCount: { median: 30 },
    memoryBytes: { median: 8 * 1024 * 1024 },
    ...overrides,
  },
})

const base = { schemaVersion: 1, routes: [route('demo', 'web')], builds: [] }

describe('budget evaluator', () => {
  it('passes the committed production evidence against the baseline', () => {
    const result = evaluateBudgets({
      baseline: JSON.parse(
        readFileSync(
          new URL('../../benchmarks/results/m0-production-2026-09-07.json', import.meta.url),
          'utf8'
        )
      ),
      current: JSON.parse(
        readFileSync(
          new URL('../../benchmarks/results/m5-production-2026-09-12.json', import.meta.url),
          'utf8'
        )
      ),
      buildBaseline: JSON.parse(
        readFileSync(
          new URL('../../benchmarks/results/m0-build-2026-09-07.json', import.meta.url),
          'utf8'
        )
      ),
      config,
      exceptions,
      buildExceptions,
    })
    expect(result.regressions).toBe(0)
  })

  it('fails on a seeded transfer regression', () => {
    const current = {
      routes: [
        route('demo', 'web', {
          totalTransferBytes: { median: 700_000 }, // +40% over the 500 KB baseline
        }),
      ],
      builds: [],
    }
    const result = evaluateBudgets({
      baseline: base,
      current,
      buildBaseline: base,
      config,
      exceptions,
      buildExceptions,
    })
    expect(result.regressions).toBe(1)
    expect(result.lines.join('\n')).toContain('transfer: +40.0% over the +10% budget')
  })

  it('marks a seeded breach as an exception when one is recorded with a reason', () => {
    const current = {
      routes: [
        route('demo', 'web', {
          totalTransferBytes: { median: 700_000 },
        }),
      ],
      builds: [],
    }
    const result = evaluateBudgets({
      baseline: base,
      current,
      buildBaseline: base,
      config,
      exceptions: [
        {
          route: 'demo',
          metric: 'transfer',
          reason: 'recorded third-party payload, owner: analytics',
        },
      ],
      buildExceptions: [],
    })
    expect(result.regressions).toBe(0)
    expect(result.exceptionsHit).toBe(1)
    expect(result.lines.join('\n')).toContain('EXCEPTION transfer')
  })

  it('flags a hard LCP ceiling breach even with a recorded growth exception', () => {
    const current = {
      routes: [
        route('demo', 'web', {
          totalTransferBytes: { median: 700_000 },
          lcpMs: { median: 2600, minimum: 2500, maximum: 4100 },
        }),
      ],
      builds: [],
    }
    const result = evaluateBudgets({
      baseline: base,
      current,
      buildBaseline: base,
      config,
      exceptions: [{ route: 'demo', metric: 'transfer', reason: 'recorded third-party payload' }],
      buildExceptions: [],
    })
    // Growth is excepted; the LCP ceiling is not exceptable. The median also
    // trips the >10% and >250 ms regression rule, so two seeded regressions.
    expect(result.regressions).toBeGreaterThanOrEqual(1)
    expect(result.lines.join('\n')).toContain('LCP: median 2600 > 2500 ms budget')
    expect(result.lines.join('\n')).toContain('LCP: worst sample 4100 > 4000 ms ceiling')
  })
})
