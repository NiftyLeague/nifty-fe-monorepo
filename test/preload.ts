/**
 * Root preload for bun:test.
 * Runs once per isolated test file (bunfig [test].preload) BEFORE the test module
 * and its imports are evaluated, so module mocks registered here win.
 *
 * happy-dom and browser API shims are registered by test/happy-dom-setup.ts.
 * Keep this preload focused on module mocks so those mocks are installed before
 * the test modules and their imports are evaluated.
 */
import { mock } from 'bun:test'
import { resolve } from 'node:path'

type ModuleExports = Record<string, unknown>

async function importFirstAvailable(...relativePaths: string[]): Promise<ModuleExports> {
  for (const relativePath of relativePaths) {
    try {
      return (await import(resolve(import.meta.dir, relativePath))) as ModuleExports
    } catch {
      // Bun 1.4.0 and the current Bun canary expose different isolated-linker
      // peer paths. Keep trying the supported layouts before failing clearly.
    }
  }

  throw new Error(`Unable to load a shared test runtime from: ${relativePaths.join(', ')}`)
}

/**
 * `solid-js`, `solid-js/store`, and `solid-js/web` resolve to inert server
 * builds under node conditions. The suite cannot pass --conditions=browser
 * globally — Node-only dependencies (e.g. @aws-sdk) select broken browser
 * bundles under it — so the DOM builds are aliased in by module ID instead.
 * happy-dom registers the DOM globals first, so the web build is safe to load.
 */
const SOLID_SUBPACKAGES: Record<string, { dom: string; entries: string[] }> = {
  '': { dom: 'dist/solid.js', entries: ['solid', 'dev', 'server'] },
  store: { dom: 'store/dist/store.js', entries: ['store', 'dev', 'server'] },
  web: { dom: 'web/dist/web.js', entries: ['web', 'dev', 'server'] },
}

const nodeModulesRoots = ['node_modules', 'node_modules/.bun/node_modules']

const domModules = new Map<string, ModuleExports>()
for (const [subpath, { dom }] of Object.entries(SOLID_SUBPACKAGES)) {
  domModules.set(
    subpath,
    await importFirstAvailable(...nodeModulesRoots.map((root) => `../${root}/solid-js/${dom}`))
  )
}

const workspaces = ['apps/app', 'apps/web', 'packages/ui']
const moduleRoots = [
  ...nodeModulesRoots,
  ...workspaces.map((workspace) => `${workspace}/node_modules`),
]

for (const [subpath, { entries }] of Object.entries(SOLID_SUBPACKAGES)) {
  const domExports = domModules.get(subpath) as ModuleExports
  const subdir = subpath ? `${subpath}/` : ''
  for (const moduleRoot of moduleRoots) {
    for (const distEntry of entries) {
      for (const ext of ['js', 'cjs']) {
        const moduleId = resolve(
          import.meta.dir,
          `../${moduleRoot}/solid-js/${subdir}dist/${distEntry}.${ext}`
        )
        mock.module(moduleId, () => ({ ...domExports, default: domExports }))
      }
    }
  }
}
