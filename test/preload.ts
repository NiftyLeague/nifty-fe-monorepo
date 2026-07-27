/**
 * Root preload for bun:test.
 * Runs once per isolated test file (bunfig [test].preload) BEFORE the test module
 * and its imports are evaluated, so module mocks registered here win.
 *
 * NOTE: happy-dom is registered by test/000-setup-dom.test.ts (NOT here) because
 * bun's preload realm is separate from the test-file realm — a GlobalRegistrator
 * call here would set the "already registered" global flag and BREAK the real
 * registration in 000-setup-dom. Only module mocks belong in preload.
 *
 * 1. Stubs the Docusaurus virtual modules that the docs app imports (mirrors the
 *    previous vitest.config resolve.alias to test/stubs/*.tsx).
 */
import { mock } from 'bun:test'
// Mirrors the previous vitest.config alias:
//   @docusaurus/Link            -> test/stubs/DocusaurusLink.tsx
//   @docusaurus/useBaseUrl     -> test/stubs/useBaseUrl.ts
//   @theme/ThemedImage          -> test/stubs/ThemedImage.tsx
mock.module('@docusaurus/Link', () => ({ default: (props: any) => null }))

mock.module('@docusaurus/useBaseUrl', () => ({ default: (s: string) => s }))

// --- next/font (bun's resolver cannot load next's generated font modules) ---
// Return a permissive stub: any named font export becomes a function returning a
// CSS-font object. Mirrors how vitest+jsdom never actually evaluated the font CSS.
const nextFontStub = () =>
  new Proxy({}, { get: () => () => ({ className: '', style: {}, variable: '' }) })

mock.module('next/font/google', nextFontStub)
mock.module('next/font/local', nextFontStub)
