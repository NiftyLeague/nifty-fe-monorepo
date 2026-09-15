import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteSolid from 'vite-plugin-solid'
import { nitro } from 'nitro/vite'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const local = (path: string) => fileURLToPath(new URL(path, import.meta.url))

// Inlined verbatim as a banner so it runs before the application module graph.
const domShim = readFileSync(local('./scripts/dom-shim.mjs'), 'utf8')

export default defineConfig({
  server: { port: 3001 },
  define: {
    // Vercel injects VERCEL_ENV into the build environment; expose it to client
    // code through the same VITE_ prefix the rest of the config uses. The app
    // selects the Immutable SDK's PRODUCTION/SANDBOX target from this value.
    'import.meta.env.VITE_VERCEL_ENV': JSON.stringify(
      process.env.VERCEL_ENV ?? process.env.VITE_VERCEL_ENV ?? ''
    ),
  },
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
    // Nitro produces the deployable server bundle (Vercel on this project).
    nitro({
      // Production deploys use the Vercel Build Output API; the E2E suite builds
      // a self-servable node server with NITRO_PRESET=node-server.
      preset: (process.env.NITRO_PRESET as 'vercel' | 'node-server' | undefined) ?? 'vercel',
      // Response headers live in vercel.json only. On this Build Output API deploy
      // Vercel applies vercel.json `headers` anyway — proven live because
      // `/assets/*` responses carry the vercel.json-only `Access-Control-Allow-Origin:
      // *` — so declaring them here as well was a second source that would drift.
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
