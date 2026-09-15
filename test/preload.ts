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

// `browser.import` (used by the test commands' --conditions=browser) resolves
// to dist/*.js while plain resolution can hit dist/*.cjs — cover both.
const solidEntrypoints = ['dist/solid.js', 'dist/solid.cjs']
const solidWebEntrypoints = ['web/dist/web.js', 'web/dist/web.cjs']

const rootSolid = await importFirstAvailable(
  ...solidEntrypoints.flatMap((entry) => [
    `../node_modules/solid-js/${entry}`,
    `../node_modules/.bun/node_modules/solid-js/${entry}`,
  ])
)
const rootSolidWeb = await importFirstAvailable(
  ...solidWebEntrypoints.flatMap((entry) => [
    `../node_modules/solid-js/${entry}`,
    `../node_modules/.bun/node_modules/solid-js/${entry}`,
  ])
)

// Bun preserves workspace-local solid-js module IDs even when they resolve to
// the same installed version. Target those IDs directly so shared Testing
// Library helpers and workspace hooks share one reactive owner in isolated
// tests (split instances break context and cleanup across the boundary).
for (const workspace of ['apps/app', 'apps/web', 'packages/ui']) {
  for (const entry of solidEntrypoints) {
    const workspaceSolid = resolve(
      import.meta.dir,
      `../${workspace}/node_modules/solid-js/${entry}`
    )
    mock.module(workspaceSolid, () => ({ ...rootSolid, default: rootSolid }))
  }
  for (const entry of solidWebEntrypoints) {
    const workspaceSolidWeb = resolve(
      import.meta.dir,
      `../${workspace}/node_modules/solid-js/${entry}`
    )
    mock.module(workspaceSolidWeb, () => ({ ...rootSolidWeb, default: rootSolidWeb }))
  }
}
