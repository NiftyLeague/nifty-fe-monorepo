import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwind from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const root = new URL('.', import.meta.url)
const local = (name) => fileURLToPath(new URL(name, root))

// Public runtime config, allowlisted one key at a time. Never expose
// process.env wholesale, and never define a server-only secret here: anything
// defined is inlined into the client bundle. The PUBLIC_* names are the
// convention the Astro apps adopted; the legacy NEXT_PUBLIC_* names stay as a
// fallback so existing deployments keep working through the cutover.
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
  // Vercel's image optimiser replaces next/image's. The runtime shim emits
  // `/_vercel/image?url=...&w=...` URLs, which this makes resolvable.
  adapter: vercel({ imageService: true }),
  integrations: [react()],
  // Inline the stylesheet: a single linked CSS file is render-blocking, and on
  // the throttled mobile profile that alone pushed first paint past 3s. The
  // Next build inlined its critical CSS, so this restores parity.
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwind()],
    css: { postcss: { plugins: [] } },
    // Bun's isolated layout resolves react-dom and the Radix packages through
    // distinct store entries. Bundling the whole SSR graph keeps one React
    // instance; a mixed externalized/bundled split duplicates the hooks
    // dispatcher. Both the legacy and environments keys are set because
    // @astrojs/react's configEnvironment hook reads the environments form.
    ssr: { noExternal: true },
    environments: { ssr: { resolve: { noExternal: true } } },
    resolve: {
      alias: [
        // The shared primitive reads next/image internals, so the app swaps in
        // a plain <img> adapter. Do not also add a tsconfig path: Bun resolves
        // the alias through the isolated store and the two disagree.
        { find: '@nl/ui/custom/optimized-image', replacement: local('src/runtime/Image.tsx') },
        { find: '@', replacement: local('src') },
      ],
    },
    // Only values the *client* bundle reads are defined here; they must be
    // inlined at build time. Server-only configuration (session secret, OAuth
    // secrets, store links) is read from process.env at request time instead,
    // so a variable rename or a per-environment value needs no rebuild.
    //
    // Each entry takes the PUBLIC_* convention first and falls back to the
    // NEXT_PUBLIC_* name the Vercel project still holds, so the cutover does not
    // require renaming variables in lockstep with the deploy.
    define: {
      'process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID': publicEnv(
        'PUBLIC_PLAYFAB_TITLE_ID',
        'NEXT_PUBLIC_PLAYFAB_TITLE_ID'
      ),
      'process.env.NEXT_PUBLIC_AUTH_PROVIDERS': publicEnv(
        'PUBLIC_AUTH_PROVIDERS',
        'NEXT_PUBLIC_AUTH_PROVIDERS'
      ),
      'process.env.NEXT_PUBLIC_VERCEL_ENV': publicEnv('PUBLIC_DEPLOY_ENV', 'VERCEL_ENV'),
      'process.env.NEXT_PUBLIC_FEATURE_FLAGS': publicEnv(
        'PUBLIC_FEATURE_FLAGS',
        'NEXT_PUBLIC_FEATURE_FLAGS'
      ),
    },
  },
})
