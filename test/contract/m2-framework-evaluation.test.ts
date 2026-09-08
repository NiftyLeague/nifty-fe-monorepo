import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'

import { readBenchmarkInteger as readAstroInteger } from '../../benchmarks/framework-prototypes/astro/src/workload'
import { readBenchmarkInteger as readReactRouterInteger } from '../../benchmarks/framework-prototypes/react-router/app/workload'
import { runCommand } from '../../scripts/m0-benchmark.mjs'
import { availablePort } from '../../scripts/m2-benchmark.mjs'

const read = (path: string) => readFileSync(path, 'utf8')
const manifestPath = 'benchmarks/m2-framework-evaluation.json'

type Decision = {
  app: string
  bucket: string
  currentFramework: string
  decision: string
  candidates: string[]
  evidence: string[]
  confidence: string
  approvedMigration: boolean
}

describe('M2 per-app framework evaluation', () => {
  it('allocates isolated runtime ports instead of trusting fixed manifest ports', async () => {
    const occupied = Bun.listen({
      hostname: '127.0.0.1',
      port: 0,
      socket: { data() {} },
    })
    try {
      expect(await availablePort()).not.toBe(occupied.port)
    } finally {
      occupied.stop(true)
    }
  })

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
    expect(manifest.applicationBuckets).toEqual([
      expect.objectContaining({ id: 'static-first', apps: ['docs', 'smashers', 'web'] }),
      expect.objectContaining({ id: 'stateful', apps: ['app'] }),
    ])
    expect(new Set(manifest.applicationControls.map(({ app }: { app: string }) => app))).toEqual(
      new Set(['app', 'docs', 'smashers', 'web'])
    )
    expect(manifest.applicationControls.every(({ bucket }: { bucket: string }) => bucket)).toBe(
      true
    )
    expect(manifest.applicationControls.map(({ app }: { app: string }) => app)).not.toContain('api')
    expect(manifest.applicationControls.map(({ app }: { app: string }) => app)).not.toContain(
      'template'
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
      expect(control.commands.start).not.toContain(String(control.port))
      expect(control.readyPath).toStartWith('/')
    }

    for (const candidate of manifest.candidates) {
      expect(candidate.fixtures).toEqual(
        expect.arrayContaining(['public', 'authenticated', 'data-heavy', 'interaction-heavy'])
      )
      expect(candidate.commands.build).toBeArray()
      expect(candidate.commands.start).toBeArray()
      expect(candidate.commands.start).not.toContain(String(candidate.port))
      if (candidate.framework !== 'next') {
        expect(candidate.disposable).toBe(true)
        expect(candidate.path).toStartWith('benchmarks/framework-prototypes/')
        expect(existsSync(candidate.path)).toBe(true)
      }
    }
  })

  it('defines measured route controls and candidate workloads for every individual app', () => {
    const manifest = JSON.parse(read(manifestPath))
    const apps = ['app', 'docs', 'smashers', 'web']

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
      expect(['static-first', 'stateful']).toContain(profile.bucket)
      expect(profile.candidates.length).toBeGreaterThan(0)
      expect(profile.routes.length).toBeGreaterThan(0)
      for (const route of profile.routes) {
        expect(route.path).toContain(`profile=${profile.app}`)
      }
    }
    expect(
      manifest.applicationProfiles.find(({ app }: { app: string }) => app === 'smashers').candidates
    ).toContain('astro')
  })

  it('records repeated same-profile runtime, caching, server, memory, and build evidence', () => {
    for (const path of ['benchmarks/results/m2-per-app-frameworks-2026-09-08.json']) {
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
      expect(report.applicationColdStarts).toHaveLength(includesApplicationControl ? 4 : 0)
      for (const coldStart of report.applicationColdStarts) {
        expect(coldStart.samples).toHaveLength(report.runCount)
        expect(coldStart.summary.median).toBeGreaterThan(0)
      }
    }
  })

  it('records five samples for every real route and every app-candidate workload', () => {
    const manifest = JSON.parse(read(manifestPath))
    const report = JSON.parse(read('benchmarks/results/m2-per-app-frameworks-2026-09-08.json'))

    const expectedControls = manifest.applicationControls.flatMap(
      ({ app, benchmarkRoutes }: { app: string; benchmarkRoutes: { fixture: string }[] }) =>
        benchmarkRoutes.map(({ fixture }) => `${app}:${fixture}`)
    )
    const measuredControls = report.applicationMeasurements.map(
      ({ application, fixture }: { application: string; fixture: string }) =>
        `${application}:${fixture}`
    )
    expect(measuredControls).toHaveLength(expectedControls.length)
    expect(measuredControls).toHaveLength(16)
    expect(new Set(measuredControls)).toEqual(new Set(expectedControls))
    for (const measurement of report.applicationMeasurements) {
      expect(measurement.samples).toHaveLength(report.runCount)
      expect(measurement.samples.every(({ loaded }: { loaded: boolean }) => loaded)).toBe(true)
    }

    const measuredProfiles = report.measurements
      .filter(({ application }: { application: string | null }) => application !== null)
      .map(
        ({ application, candidate, fixture }: Record<string, string>) =>
          `${application}:${candidate}:${fixture}`
      )
    const expectedProfiles = manifest.applicationProfiles.flatMap(
      ({ app, candidates, routes }: Record<string, string[] | { fixture: string }[]>) =>
        (candidates as string[]).flatMap((candidate) =>
          (routes as { fixture: string }[]).map(({ fixture }) => `${app}:${candidate}:${fixture}`)
        )
    )
    expect(measuredProfiles).toHaveLength(expectedProfiles.length)
    expect(measuredProfiles).toHaveLength(52)
    expect(new Set(measuredProfiles)).toEqual(new Set(expectedProfiles))

    const genericMeasurements = report.measurements.filter(
      ({ application }: { application: string | null }) => application === null
    )
    expect(genericMeasurements).toHaveLength(20)
    expect(
      genericMeasurements.every(({ samples }: { samples: { loaded: boolean }[] }) =>
        samples.every(({ loaded }) => loaded)
      )
    ).toBe(true)

    for (const measurement of report.measurements.filter(
      ({ application }: { application: string | null }) => application !== null
    )) {
      expect(measurement.samples).toHaveLength(report.runCount)
      expect(measurement.samples.every(({ loaded }: { loaded: boolean }) => loaded)).toBe(true)
    }
  })

  it('publishes one complete, evidence-backed decision for every evaluated app', () => {
    const manifest = JSON.parse(read(manifestPath))
    const decisions = manifest.decisions as Decision[]
    expect(new Set(decisions.map(({ app }) => app))).toEqual(
      new Set(['app', 'docs', 'smashers', 'web'])
    )

    for (const decision of decisions) {
      expect(decision.currentFramework).toBeTruthy()
      expect(['static-first', 'stateful']).toContain(decision.bucket)
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

    expect(record).toContain('M2.5 migration gate')
    expect(record).toContain('cannot shadow production routes')
    expect(record).toContain('Route-by-route acceptance')
    if (approved.length === 0) {
      expect(record).toContain('No production framework migration is approved')
    }
  })
})
