import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import vercel from '@astrojs/vercel'
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

// Vercel's optimizer accepts exactly these widths — published both to the
// deploy config (imagesConfig) and to the image service (image.service.config,
// where the adapter's validation reads them from).
const vercelImageConfig = {
  sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  domains: [],
  remotePatterns: [],
}

export default defineConfig({
  site: 'https://niftysmashers.com',
  output: 'server',
  // astro:assets resolves to the app's gated Vercel image service
  // (src/runtime/vercel-image-service.ts): optimizer URLs on Vercel, plain
  // asset paths everywhere else. The adapter no longer forces its own service
  // (imageService: false) but still publishes the optimizer's accepted widths
  // into the deploy config, so /_vercel/image resolves exactly as it did
  // before.
  adapter: vercel({ imageService: false, imagesConfig: vercelImageConfig }),
  image: {
    service: { entrypoint: './src/runtime/vercel-image-service.ts', config: vercelImageConfig },
  },
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
    //
    // Each entry takes the PUBLIC_* name; VERCEL_ENV is Vercel's own
    // build-environment variable and stands in when PUBLIC_DEPLOY_ENV is not
    // set explicitly.
    define: {
      'process.env.PUBLIC_PLAYFAB_TITLE_ID': publicEnv('PUBLIC_PLAYFAB_TITLE_ID'),
      'import.meta.env.PUBLIC_AUTH_PROVIDERS': publicEnv('PUBLIC_AUTH_PROVIDERS'),
      'process.env.PUBLIC_DEPLOY_ENV': publicEnv('PUBLIC_DEPLOY_ENV', 'VERCEL_ENV'),
      'process.env.PUBLIC_FEATURE_FLAGS': publicEnv('PUBLIC_FEATURE_FLAGS'),
    },
  },
})
