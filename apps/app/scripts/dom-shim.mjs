/**
 * Minimal DOM globals for the server bundle.
 *
 * The wallet stack reaches `@reown/appkit`, whose Lit-based UI reads
 * `HTMLElement` while the module is being evaluated. That runs before any
 * request is served, so server rendering fails with `HTMLElement is not
 * defined` even though no wallet UI ever renders on the server.
 *
 * `vite.config.ts` inlines this file as a banner on the server chunks, so it
 * runs before the application module graph. Nothing here is a working DOM:
 * every class is an inert stand-in, and `??=` leaves the real globals alone in
 * the browser.
 */
// The stand-ins are deliberately featureless: they only need to exist as
// constructors so module-scope `class X extends HTMLElement` evaluates.
// oxlint-disable-next-line typescript/no-extraneous-class
const inertClass = () => class {}

const INERT_GLOBALS = {
  CustomElementRegistry: class {
    define() {}
    get() {
      return undefined
    }
    whenDefined() {
      return Promise.resolve()
    }
  },
  Document: inertClass(),
  DocumentFragment: inertClass(),
  Element: inertClass(),
  Event: inertClass(),
  EventTarget: inertClass(),
  HTMLElement: inertClass(),
  MutationObserver: class {
    disconnect() {}
    observe() {}
    takeRecords() {
      return []
    }
  },
  Node: inertClass(),
  ShadowRoot: inertClass(),
}

for (const [name, value] of Object.entries(INERT_GLOBALS)) {
  globalThis[name] ??= value
}

globalThis.customElements ??= new INERT_GLOBALS.CustomElementRegistry()
