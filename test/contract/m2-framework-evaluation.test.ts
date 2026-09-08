import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'

import { readBenchmarkInteger as readAstroInteger } from '../../benchmarks/framework-prototypes/astro/src/workload'
import { readBenchmarkInteger as readReactRouterInteger } from '../../benchmarks/framework-prototypes/react-router/app/workload'
import { runCommand } from '../../scripts/m0-benchmark.mjs'

const read = (path: string) => readFileSync(path, 'utf8')
const manifestPath = 'benchmarks/m2-framework-evaluation.json'

type Decision = {
  app: string
  currentFramework: string
  decision: string
  candidates: string[]
  evidence: string[]
  confidence: string
  approvedMigration: boolean
}

describe('M2 per-app framework evaluation', () => {
  it('uses declared workload defaults when a query parameter is absent', () => {
    expect(readAstroInteger(null, 150)).toBe(150)
    expect(readReactRouterInteger(null, 150)).toBe(150)
  })

  it('runs candidate commands in their declared working directory', async () => {
    const result = await runCommand('bun', ['-e', 'console.log(process.cwd())'], {
      cwd: 'benchmarks/framework-prototypes/next',
    })
    expect(result.exitCode).toBe(0)
    expect(result.stdout.trim()).toEndWith('benchmarks/framework-prototypes/next')
  })

  it('defines comparable controls and isolated prototypes for every evaluated candidate', () => {
    expect(existsSync(manifestPath)).toBe(true)
    const manifest = JSON.parse(read(manifestPath))

    expect(manifest.runCount).toBeGreaterThanOrEqual(5)
    expect(manifest.profile.cacheModes).toEqual(['cold', 'warm'])
    expect(manifest.profile.journeys).toEqual(
      expect.arrayContaining(['document-load', 'client-navigation', 'interaction'])
    )
    expect(
      new Set(manifest.candidates.map(({ framework }: { framework: string }) => framework))
    ).toEqual(new Set(['next', 'tanstack-start', 'astro', 'react-router']))
    expect(new Set(manifest.applicationControls.map(({ app }: { app: string }) => app))).toEqual(
      new Set(['api', 'app', 'docs', 'smashers', 'template', 'web'])
    )
    for (const control of manifest.applicationControls) {
      expect(Object.keys(control.routes)).toEqual(
        expect.arrayContaining(['public', 'authenticated', 'data-heavy', 'interaction-heavy'])
      )
      expect(Object.keys(control.rendering)).toEqual(
        expect.arrayContaining([
          'ssr',
          'ssg',
          'streaming',
          'clientNavigation',
          'hydration',
          'caching',
        ])
      )
      expect(existsSync(control.runtimeEvidence)).toBe(true)
      expect(existsSync(control.buildEvidence)).toBe(true)
      expect(control.commands.start).toBeArray()
      expect(control.readyPath).toStartWith('/')
    }

    for (const candidate of manifest.candidates) {
      expect(candidate.fixtures).toEqual(
        expect.arrayContaining(['public', 'authenticated', 'data-heavy', 'interaction-heavy'])
      )
      expect(candidate.commands.build).toBeArray()
      expect(candidate.commands.start).toBeArray()
      if (candidate.framework !== 'next') {
        expect(candidate.disposable).toBe(true)
        expect(candidate.path).toStartWith('benchmarks/framework-prototypes/')
        expect(existsSync(candidate.path)).toBe(true)
      }
    }
  })

  it('defines measured route controls and candidate workloads for every individual app', () => {
    const manifest = JSON.parse(read(manifestPath))
    const apps = ['api', 'app', 'docs', 'smashers', 'template', 'web']

    expect(new Set(manifest.applicationProfiles.map(({ app }: { app: string }) => app))).toEqual(
      new Set(apps)
    )
    for (const control of manifest.applicationControls) {
      expect(control.benchmarkRoutes.length).toBeGreaterThan(0)
      for (const route of control.benchmarkRoutes) {
        expect(route.fixture).toBeTruthy()
        expect(route.path).toStartWith('/')
      }
    }
    for (const profile of manifest.applicationProfiles) {
      expect(profile.candidates.length).toBeGreaterThan(0)
      expect(profile.routes.length).toBeGreaterThan(0)
      for (const route of profile.routes) {
        expect(route.path).toContain(`profile=${profile.app}`)
      }
    }
  })

  it('records repeated same-profile runtime, caching, server, memory, and build evidence', () => {
    for (const path of [
      'benchmarks/results/m2-per-app-next-control-2026-09-08.json',
      'benchmarks/results/m2-per-app-candidates-2026-09-08.json',
    ]) {
      expect(existsSync(path)).toBe(true)
      const report = JSON.parse(read(path))
      expect(report.schemaVersion).toBe(1)
      expect(report.profileId).toBe('m2-local-production-desktop-v1')
      expect(report.runCount).toBeGreaterThanOrEqual(5)
      expect(report.measurements.length).toBeGreaterThan(0)

      for (const measurement of report.measurements) {
        expect(measurement.samples).toHaveLength(report.runCount)
        for (const metric of [
          'ttfbMs',
          'lcpMs',
          'inpMs',
          'cls',
          'totalTransferBytes',
          'javascriptBytes',
          'requestCount',
          'memoryBytes',
          'serverResponseMs',
          'responseCompleteMs',
          'streamGapMs',
        ]) {
          expect(Object.hasOwn(measurement.summary, metric)).toBe(true)
        }
        if (measurement.fixture === 'interaction-heavy' && measurement.summary.inpMs !== null) {
          expect(measurement.summary.inpMs.median).toBeGreaterThanOrEqual(16)
        }
        expect(measurement.cache.cold).toBeTruthy()
        expect(measurement.cache.warm).toBeTruthy()
      }

      for (const build of report.builds) {
        expect(build.clean.samples).toHaveLength(report.runCount)
        expect(build.incremental.samples).toHaveLength(report.runCount)
        expect(build.outputBytes).toBeGreaterThan(0)
        expect(build.clientJavaScriptBytes).toBeGreaterThanOrEqual(0)
      }

      expect(report.coldStarts).toHaveLength(report.candidates.length)
      for (const coldStart of report.coldStarts) {
        expect(coldStart.samples).toHaveLength(report.runCount)
        expect(coldStart.summary.median).toBeGreaterThan(0)
      }
      const includesApplicationControl = report.candidates.some(
        ({ id }: { id: string }) => id === 'next-control'
      )
      expect(report.applicationColdStarts).toHaveLength(includesApplicationControl ? 6 : 0)
      for (const coldStart of report.applicationColdStarts) {
        expect(coldStart.samples).toHaveLength(report.runCount)
        expect(coldStart.summary.median).toBeGreaterThan(0)
      }
    }
  })

  it('records five samples for every real route and every app-candidate workload', () => {
    const manifest = JSON.parse(read(manifestPath))
    const controlReport = JSON.parse(
      read('benchmarks/results/m2-per-app-next-control-2026-09-08.json')
    )
    const candidateReport = JSON.parse(
      read('benchmarks/results/m2-per-app-candidates-2026-09-08.json')
    )

    const expectedControls = manifest.applicationControls.flatMap(
      ({ app, benchmarkRoutes }: { app: string; benchmarkRoutes: { fixture: string }[] }) =>
        benchmarkRoutes.map(({ fixture }) => `${app}:${fixture}`)
    )
    const measuredControls = controlReport.applicationMeasurements.map(
      ({ application, fixture }: { application: string; fixture: string }) =>
        `${application}:${fixture}`
    )
    expect(new Set(measuredControls)).toEqual(new Set(expectedControls))
    for (const measurement of controlReport.applicationMeasurements) {
      expect(measurement.samples).toHaveLength(controlReport.runCount)
      expect(measurement.samples.every(({ loaded }: { loaded: boolean }) => loaded)).toBe(true)
    }

    const reports = [controlReport, candidateReport]
    const measuredProfiles = reports.flatMap(({ measurements }) =>
      measurements
        .filter(({ application }: { application: string | null }) => application !== null)
        .map(
          ({ application, candidate, fixture }: Record<string, string>) =>
            `${application}:${candidate}:${fixture}`
        )
    )
    const expectedProfiles = manifest.applicationProfiles.flatMap(
      ({ app, candidates, routes }: Record<string, string[] | { fixture: string }[]>) =>
        (candidates as string[]).flatMap((candidate) =>
          (routes as { fixture: string }[]).map(({ fixture }) => `${app}:${candidate}:${fixture}`)
        )
    )
    expect(new Set(measuredProfiles)).toEqual(new Set(expectedProfiles))

    for (const report of reports) {
      for (const measurement of report.measurements.filter(
        ({ application }: { application: string | null }) => application !== null
      )) {
        expect(measurement.samples).toHaveLength(report.runCount)
        expect(measurement.samples.every(({ loaded }: { loaded: boolean }) => loaded)).toBe(true)
      }
    }
  })

  it('publishes one complete, evidence-backed decision for every deployable app', () => {
    const manifest = JSON.parse(read(manifestPath))
    const decisions = manifest.decisions as Decision[]
    expect(new Set(decisions.map(({ app }) => app))).toEqual(
      new Set(['api', 'app', 'docs', 'smashers', 'template', 'web'])
    )

    for (const decision of decisions) {
      expect(decision.currentFramework).toBeTruthy()
      expect(decision.decision).toBeTruthy()
      expect(decision.candidates.length).toBeGreaterThan(0)
      expect(decision.evidence.length).toBeGreaterThan(0)
      expect(['high', 'moderate', 'low']).toContain(decision.confidence)
      expect(typeof decision.approvedMigration).toBe('boolean')

      const adrPath = `docs/architecture/decisions/m2-${decision.app}-framework.md`
      expect(existsSync(adrPath)).toBe(true)
      const adr = read(adrPath)
      for (const section of [
        'Status and decision',
        'Measured evidence',
        'Hosting and operations',
        'Authentication and data',
        'SEO, accessibility, and observability',
        'Migration friction and maintenance',
        'Rollback and route acceptance',
      ]) {
        expect(adr).toContain(section)
      }
    }
  })

  it('keeps M2.5 gated by the recorded approvals and forbids parallel production routes', () => {
    const manifest = JSON.parse(read(manifestPath))
    const approved = manifest.decisions.filter(
      ({ approvedMigration }: Decision) => approvedMigration
    )
    const record = read('docs/architecture/m2-framework-evaluation.md')

    expect(record).toContain('M2.5 migration execution')
    expect(record).toContain('No dead parallel routes')
    expect(record).toContain('Route-by-route acceptance')
    if (approved.length === 0) {
      expect(record).toContain('No production framework migration is approved')
    }
  })
})
