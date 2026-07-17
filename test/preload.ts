/**
 * Root preload for bun:test.
 * Runs once per isolated test file (bunfig [test].preload) BEFORE the test module
 * and its imports are evaluated, so module mocks registered here win.
 *
 * 1. Registers happy-dom as the global DOM environment (replaces vitest `jsdom`).
 * 2. Stubs the Docusaurus virtual modules that the docs app imports. Under vitest
 *    these were resolved via `resolve.alias` to test/stubs/*.tsx — here we register
 *    them as module mocks (same effect, no real package needed).
 */
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { mock } from 'bun:test';

// --- happy-dom global registration (jsdom replacement) ---
GlobalRegistrator.register();

// --- Docusaurus / theme virtual-module stubs ---
// Mirrors the previous vitest.config alias:
//   @docusaurus/Link            -> test/stubs/DocusaurusLink.tsx
//   @docusaurus/useBaseUrl     -> test/stubs/useBaseUrl.ts
//   @theme/ThemedImage          -> test/stubs/ThemedImage.tsx
mock.module('@docusaurus/Link', () => ({
  default: (props: any) => null,
}));

mock.module('@docusaurus/useBaseUrl', () => ({
  default: (s: string) => s,
}));

// --- next/font (bun's resolver cannot load next's generated font modules) ---
// Return a permissive stub: any named font export becomes a function returning a
// CSS-font object. Mirrors how vitest+jsdom never actually evaluated the font CSS.
const nextFontStub = () =>
  new Proxy(
    {},
    {
      get: () => () => ({ className: '', style: {}, variable: '' }),
    },
  );

mock.module('next/font/google', nextFontStub);
mock.module('next/font/local', nextFontStub);
