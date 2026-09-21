import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteSolid from 'vite-plugin-solid'
import { nitro } from 'nitro/vite'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

import { SECURITY_HEADERS } from './scripts/headers-content.mjs'

const local = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// Inlined verbatim as a banner so it runs before the application module graph.
const domShim = readFileSync(local('./scripts/dom-shim.mjs'), 'utf8')

export default defineConfig({
  server: { port: 3001 },
  // Resolve the `@/*` alias from tsconfig.json so app imports keep working.
  resolve: {
    tsconfigPaths: true,
  },
  // Note: bundler-level chunk consolidation (rolldown `codeSplitting` groups)
  // was tried for the mobile request-count problem and reverted — merging
  // modules across the route-split graph created circular chunk imports that
  // broke ESM eval order at runtime (viem LruMap "not a constructor").
  plugins: [
    tailwindcss(),
    tanstackStart({ srcDirectory: 'src' }),
    // The Solid plugin must come after TanStack Start's.
    viteSolid({ ssr: true }),
    // Nitro produces the deployable server bundle (Cloudflare Workers in
    // production; scripts/post-build-worker.mjs wraps the entry after the
    // build). The E2E suite builds a self-servable node server with
    // NITRO_PRESET=node-server.
    nitro({
      preset:
        (process.env.NITRO_PRESET as 'cloudflare_module' | 'node-server' | undefined) ??
        'cloudflare_module',
      // Static `/assets/*` responses carry the immutable cache rule and the
      // `Access-Control-Allow-Origin: *` header from `.output/public/_headers`,
      // which Nitro generates for the Workers deploy.
      // SSR responses must carry the same security headers the platform config
      // used to apply to every response; static assets get theirs from
      // `_headers` (see scripts/headers-content.mjs).
      routeRules: { '/**': { headers: SECURITY_HEADERS } },
      rollupConfig: {
        // The Coinbase connector wagmi pulls in optionally declares `@x402/*`
        // peer dependencies that are not installed. Nitro bundles the whole
        // server graph, so resolving those stubs fails; keeping the wallet SDKs
        // external leaves them as real runtime requires instead.
        external: [/@coinbase\/cdp-sdk/, /@x402\//],
        output: {
          // AppKit's Lit UI reads `HTMLElement` at module scope, which fails in
          // Node before any request is served.
          banner: domShim,
        },
      },
    }),
  ],
  preview: { allowedHosts: ['amf-mb-pro'] },
})
