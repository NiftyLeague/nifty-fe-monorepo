import { fileURLToPath } from 'node:url'

/**
 * Configuration shared by the three Astro surfaces (web, smashers, docs).
 *
 * Only the settings that are identical in every app live here. This module has
 * no dependencies and instantiates no Vite plugins or integrations, because
 * Bun's isolated layout resolves those through the app's own store entry — a
 * shared plugin instance would resolve against this package instead.
 */

/**
 * Public assets are served from the repository-level `assets` directory, which
 * each app points at rather than copying.
 */
export const ASSETS_PUBLIC_DIR = '../../assets'

/**
 * Inline the stylesheet into the document. A single linked CSS file is
 * render-blocking, and on the throttled mobile profile that alone pushed first
 * paint past 3s for the Astro apps; the Next builds inlined their critical CSS,
 * so this keeps parity.
 */
export const INLINE_STYLESHEETS = 'always'

/** Resolves a path inside the app that owns `configUrl` (`import.meta.url`). */
export const appLocal = (configUrl) => (name) => fileURLToPath(new URL(name, configUrl))

/** The `@/*` source alias, resolved from the owning app's root. */
export const sourceAlias = (configUrl) => ({
  find: '@',
  replacement: fileURLToPath(new URL('src', configUrl)),
})

/**
 * Bundle the whole SSR graph instead of externalizing it.
 *
 * Bun's isolated layout resolves react-dom and the Radix packages through
 * distinct store entries. Bundling the whole SSR graph keeps one React
 * instance; a mixed externalized/bundled split duplicates the hooks dispatcher.
 * Both the legacy `ssr` key and the `environments` form are set because
 * @astrojs/react's configEnvironment hook reads the environments form.
 */
export const bundleSsrGraph = () => ({
  ssr: { noExternal: true },
  environments: { ssr: { resolve: { noExternal: true } } },
})
