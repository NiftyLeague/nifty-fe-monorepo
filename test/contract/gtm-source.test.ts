import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * GTM container-loading contract.
 *
 * The container bootstrap (script id, `gtm.js` start push, async append) used to
 * be restated in every surface that loads it. It now has one definition in
 * `packages/ui/src/lib/gtm/loadGoogleTagManager.ts`, and every surface must call
 * it rather than restating the URL or the script id.
 */

const SHARED_LOADER = 'packages/ui/src/lib/gtm/loadGoogleTagManager.ts'
const REACT_BOUNDARY = 'packages/ui/src/lib/gtm/GoogleTagManager/index.tsx'
const DOCS_ANALYTICS = 'apps/docs/src/components/Analytics.astro'

/**
 * Every surface that loads the container now calls the shared loader, so the URL
 * literal must appear nowhere else. The deferred web/smashers modules were the
 * last holdouts; they pass their own script id so their DOM is unchanged.
 */
const PENDING_MIGRATION: string[] = []

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

const collectSourceFiles = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(join(process.cwd(), dir))) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '.astro') continue
    const relative = join(dir, entry)
    if (statSync(join(process.cwd(), relative)).isDirectory()) collectSourceFiles(relative, out)
    else if (/\.(ts|tsx|astro|mjs|js)$/.test(entry) && !/\.test\.|\.spec\./.test(entry))
      out.push(relative)
  }
  return out
}

describe('GTM container loading', () => {
  it('defines the container URL and script id in exactly one module', () => {
    const surfaces = ['apps/docs/src', 'apps/web/src', 'apps/smashers/src', 'packages/ui/src']
    const owners = surfaces
      .flatMap((dir) => collectSourceFiles(dir))
      .filter((file) => /googletagmanager\.com\/gtm\.js/.test(read(file, 'utf8')))
      .toSorted()

    expect(owners).toEqual([SHARED_LOADER, ...PENDING_MIGRATION].toSorted())
  })

  it('publishes the shared loader through the package exports map', () => {
    const exports = JSON.parse(read('packages/ui/package.json')).exports as Record<string, string>

    expect(exports['./gtm/load']).toBe(`./src/lib/gtm/loadGoogleTagManager.ts`)
  })

  it('loads the container in the deferred apps through the shared loader', () => {
    const web = read('apps/web/src/runtime/telemetry.ts')
    const smashers = read('apps/smashers/src/runtime/telemetry.ts')

    for (const [app, source, scriptId] of [
      ['web', web, 'web-gtm'],
      ['smashers', smashers, 'smashers-gtm'],
    ] as const) {
      expect(source, `${app} must call the shared loader`).toContain('loadGoogleTagManager(')
      // Their own script ids are preserved, so adopting the loader changes
      // nothing observable in the DOM.
      expect(source, `${app} must keep its script id`).toContain(`'${scriptId}'`)
      expect(source, `${app} must not restate the append`).not.toContain('createElement')
    }
  })

  it('loads the container in docs through the shared loader', () => {
    const source = read(DOCS_ANALYTICS)

    expect(source).toContain("from '@nl/ui/gtm/load'")
    expect(source).toContain('loadGoogleTagManager')
    // The bootstrap itself must not be restated: no script id, no manual append.
    expect(source).not.toContain('_next-gtm')
    expect(source).not.toContain('createElement')
    // The docs page keeps its own schedule, which is the reason it does not use
    // the shared React boundary.
    expect(source).toContain('requestIdleCallback')
  })

  it('routes the shared React boundary through the same loader', () => {
    const source = read(REACT_BOUNDARY)

    expect(source).toContain("from '../loadGoogleTagManager'")
    expect(source).not.toContain('createElement')
    expect(source).not.toContain('_next-gtm')
  })
})

describe('web-vitals payload and analytics gates (#1903)', () => {
  // One payload shape everywhere: the web/smashers shape — metric_id,
  // metric_rating, raw values, non_interaction — owned by the shared reporter.
  // The inline `layer.push` payloads this decision retired must not return.
  it('reports web vitals through the shared reporter only', () => {
    expect(read('packages/ui/src/lib/gtm/events.ts')).toContain('metric_rating')

    for (const surface of [
      'apps/web/src/runtime/telemetry.ts',
      'apps/smashers/src/runtime/telemetry.ts',
    ]) {
      const source = read(surface)
      expect(source, `${surface} must use the shared reporter`).toContain('sendWebVitals')
      expect(source, `${surface} must not inline the payload`).not.toContain("event: 'web_vitals'")
    }
  })

  it('gates analytics to production on every surface through the shared policy', () => {
    const gated = [
      'apps/web/src/layouts/Base.astro',
      'apps/smashers/src/layouts/Base.astro',
      'apps/docs/src/components/Analytics.astro',
      'apps/app/src/components/runtime/DeferredAnalytics.tsx',
    ]
    for (const surface of gated) {
      expect(read(surface), `${surface} must use the shared gate`).toContain(
        'productionTelemetryEnabled'
      )
    }
  })
})
