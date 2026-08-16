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
mock.module('@docusaurus/Link', () => ({ default: (props: any) => null }))

mock.module('@docusaurus/useBaseUrl', () => ({ default: (s: string) => s }))

// --- next/font (bun's resolver cannot load next's generated font modules) ---
// Return a permissive stub: any named font export becomes a function returning a
// CSS-font object. Mirrors how the previous jsdom setup never evaluated the font CSS.
const nextFontStub = () =>
  new Proxy({}, { get: () => () => ({ className: '', style: {}, variable: '' }) })

mock.module('next/font/google', nextFontStub)
mock.module('next/font/local', nextFontStub)
