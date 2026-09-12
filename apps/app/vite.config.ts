import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
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
    alias: [
      // The shared optimized-image component depends on a framework image
      // pipeline. This app renders the same props contract natively instead.
      {
        find: '@nl/ui/custom/optimized-image',
        replacement: local('./src/runtime/OptimizedImage.tsx'),
      },
      // The shared font helpers are a build-time primitive with no runtime
      // counterpart; the app loads the woff2 files from its own stylesheet.
      { find: '@nl/ui/fonts', replacement: local('./src/runtime/fonts.ts') },
    ],
  },
  plugins: [
    tailwindcss(),
    tanstackStart({ srcDirectory: 'src' }),
    // React's plugin must come after TanStack Start's.
    viteReact(),
    // Nitro produces the deployable server bundle (Vercel on this project).
    nitro({
      preset: 'vercel',
      // Response headers are declared here rather than in vercel.json because a
      // Build Output API deploy uses the generated .vercel/output/config.json as
      // the source of truth for routing and headers.
      routeRules: {
        '/**': {
          headers: {
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
            'Strict-Transport-Security': 'max-age=31536000',
          },
        },
      },
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
})
