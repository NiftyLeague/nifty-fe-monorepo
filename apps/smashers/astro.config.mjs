import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import solid from '@astrojs/solid-js'
import tailwind from '@tailwindcss/vite'
import { INLINE_STYLESHEETS, appLocal, bundleSsrGraph, sourceAlias } from '@nl/astro-config'

const local = appLocal(import.meta.url)

// Public runtime config, allowlisted one key at a time. Never expose
// process.env wholesale, and never define a server-only secret here: anything
// defined is inlined into the client bundle. The PUBLIC_* names are the
// convention the Astro apps use.
//
// An unset variable becomes an empty string rather than `undefined`, because a
// define is a textual substitution and consumers compare against a value.
// Consumers must therefore treat '' as "not configured" — see parseFlags.
const publicEnv = (name, ...fallbacks) => {
  const value = [name, ...fallbacks].map((key) => process.env[key]).find(Boolean) ?? ''
  return JSON.stringify(value)
}

export default defineConfig({
  site: 'https://niftysmashers.com',
  output: 'server',
  // The Vercel image-optimizer gate (runtime/image-url.ts) collapses to plain
  // asset paths on Cloudflare — the exact behaviour every non-Vercel build,
  // test, and E2E run already exercised. imageService: 'custom' makes the
  // adapter keep the app service below instead of forcing its Cloudflare
  // Images binding, and session: false avoids the adapter's session KV
  // binding (the app manages sessions with iron-session).
  adapter: cloudflare({ imageService: 'custom', configPath: './astro.wrangler.jsonc' }),
  image: { service: { entrypoint: './src/runtime/image-service.ts' } },
  session: false,
  integrations: [solid()],
  build: { inlineStylesheets: INLINE_STYLESHEETS },
  vite: {
    plugins: [tailwind()],
    css: { postcss: { plugins: [] } },
    ...bundleSsrGraph(),
    resolve: {
      alias: [
        // The shared primitive ships next/image-era defaults, so the app swaps
        // in its own React adapter (src/runtime/Image.tsx) over the astro:assets
        // image service. Do not also add a tsconfig path: Bun resolves the
        // alias through the isolated store and the two disagree.
        { find: '@nl/ui/custom/optimized-image', replacement: local('src/runtime/Image.tsx') },
        sourceAlias(import.meta.url),
      ],
    },
    // Only values the *client* bundle reads are defined here; they must be
    // inlined at build time. Server-only configuration (session secret, OAuth
    // secrets, store links) is read from process.env at request time instead,
    // so a variable rename or a per-environment value needs no rebuild.
    define: {
      'process.env.PUBLIC_PLAYFAB_TITLE_ID': publicEnv('PUBLIC_PLAYFAB_TITLE_ID'),
      'import.meta.env.PUBLIC_AUTH_PROVIDERS': publicEnv('PUBLIC_AUTH_PROVIDERS'),
      'process.env.PUBLIC_DEPLOY_ENV': publicEnv('PUBLIC_DEPLOY_ENV'),
      'process.env.PUBLIC_FEATURE_FLAGS': publicEnv('PUBLIC_FEATURE_FLAGS'),
    },
  },
})
