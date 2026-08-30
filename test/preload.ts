/**
 * Root preload for bun:test.
 * Runs once per isolated test file (bunfig [test].preload) BEFORE the test module
 * and its imports are evaluated, so module mocks registered here win.
 *
 * happy-dom and browser API shims are registered by test/happy-dom-setup.ts.
 * Keep this preload focused on module mocks so those mocks are installed before
 * the test modules and their imports are evaluated.
 *
 * 1. Stubs the Docusaurus virtual modules that the docs app imports.
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

const rootReactModule = await importFirstAvailable(
  '../node_modules/react/index.js',
  '../node_modules/.bun/node_modules/react/index.js'
)
const rootReact = (rootReactModule.default ?? rootReactModule) as ModuleExports
const rootReactDom = await importFirstAvailable(
  '../node_modules/react-dom/index.js',
  '../node_modules/.bun/node_modules/react-dom/index.js'
)
const rootReactDomClient = await importFirstAvailable(
  '../node_modules/react-dom/client.js',
  '../node_modules/.bun/node_modules/react-dom/client.js'
)

// Bun preserves workspace-local React module IDs even when they resolve to the
// same installed version. Target those IDs directly so shared Testing Library
// helpers and workspace hooks use one React dispatcher in isolated tests.
for (const workspace of ['apps/app', 'apps/template', 'apps/web', 'packages/ui']) {
  const workspaceReact = resolve(import.meta.dir, `../${workspace}/node_modules/react/index.js`)
  mock.module(workspaceReact, () => ({ ...rootReact, default: rootReact }))

  const workspaceReactDom = resolve(
    import.meta.dir,
    `../${workspace}/node_modules/react-dom/index.js`
  )
  mock.module(workspaceReactDom, () => ({ ...rootReactDom, default: rootReactDom }))

  const workspaceReactDomClient = resolve(
    import.meta.dir,
    `../${workspace}/node_modules/react-dom/client.js`
  )
  mock.module(workspaceReactDomClient, () => ({
    ...rootReactDomClient,
    default: rootReactDomClient,
  }))
}

mock.module('@docusaurus/Link', () => ({ default: (props: any) => null }))

mock.module('@docusaurus/useBaseUrl', () => ({ default: (s: string) => s }))

// --- next/font (bun's resolver cannot load next's generated font modules) ---
// Return a permissive stub: any named font export becomes a function returning a
// CSS-font object. Mirrors how the previous jsdom setup never evaluated the font CSS.
const nextFontStub = () =>
  new Proxy({}, { get: () => () => ({ className: '', style: {}, variable: '' }) })

mock.module('next/font/google', nextFontStub)
mock.module('next/font/local', nextFontStub)
