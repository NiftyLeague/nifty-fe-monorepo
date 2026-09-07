import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'

import {
  REQUIRED_ROUTE_METRICS,
  runCommand,
  summarizeSamples,
  validateBenchmarkConfig,
} from '../../scripts/m0-benchmark.mjs'

const configPath = 'benchmarks/m0-routes.json'
const decisionRecordPath = 'docs/architecture/m0-baseline-and-decision-gates.md'
const rootManifestPath = 'package.json'

describe('M0 baseline and decision gates', () => {
  it('keeps a route for every deployable app and captures the required route metrics', () => {
    expect(existsSync(configPath)).toBe(true)
    const config = JSON.parse(readFileSync(configPath, 'utf8'))
    const rootManifest = JSON.parse(readFileSync(rootManifestPath, 'utf8'))

    expect(validateBenchmarkConfig(config)).toEqual([])
    expect(rootManifest.scripts['benchmark:m0']).toBe('bun scripts/m0-benchmark.mjs')
    expect(config.buildRunCount).toBeGreaterThanOrEqual(3)
    expect(new Set(config.routes.map((route: { app: string }) => route.app))).toEqual(
      new Set(['api', 'app', 'docs', 'smashers', 'template', 'web'])
    )
    expect(REQUIRED_ROUTE_METRICS).toEqual([
      'lcpMs',
      'inpMs',
      'cls',
      'ttfbMs',
      'totalTransferBytes',
      'javascriptBytes',
      'cssBytes',
      'requestCount',
      'memoryBytes',
    ])
  })

  it('reports median, spread, and a confidence note from repeated samples', () => {
    expect(summarizeSamples([100, 200, 300])).toEqual({
      count: 3,
      median: 200,
      p75: 250,
      minimum: 100,
      maximum: 300,
      standardDeviation: 100,
      confidence: 'low: fewer than 5 runs',
    })
  })

  it('retains stdout and stderr diagnostics for failed build commands', async () => {
    const result = await runCommand('bun', ['--filter', '__m0_missing_workspace__', 'build'])

    expect(result.exitCode).not.toBe(0)
    expect(result.stdout.length + result.stderr.length).toBeGreaterThan(0)
  })

  it('keeps the versioned inventory, state map, budgets, and rollback rules together', () => {
    expect(existsSync(decisionRecordPath)).toBe(true)
    const record = readFileSync(decisionRecordPath, 'utf8')

    for (const section of [
      'Route and ownership inventory',
      'State and data ownership',
      'Budgets and decision gates',
      'Rollback and compatibility constraints',
      'Benchmark operation',
    ]) {
      expect(record).toContain(section)
    }
  })
})
