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
// Resolve the root Bun linker entries explicitly. The repository uses Bun's
// isolated linker, so these are the same React runtimes that root test
// dependencies resolve without following each workspace's external cache link.
import rootReact from '../node_modules/.bun/node_modules/react/index.js'
import * as rootReactDom from '../node_modules/.bun/node_modules/react-dom/index.js'
import * as rootReactDomClient from '../node_modules/.bun/node_modules/react-dom/client.js'

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
