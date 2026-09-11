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
const publicEnv = (name, ...fallbacks) => {
  const value = [name, ...fallbacks].map((key) => process.env[key]).find(Boolean) ?? ''
  return JSON.stringify(value)
}

export default defineConfig({
  site: 'https://niftysmashers.com',
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
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
      'process.env.NEXT_PUBLIC_SITE_URL': publicEnv('PUBLIC_SITE_URL', 'NEXT_PUBLIC_SITE_URL'),
      'process.env.NEXT_PUBLIC_APPLE_STORE_ID': publicEnv('PUBLIC_APPLE_STORE_ID'),
      'process.env.NEXT_PUBLIC_APPLE_STORE_LINK': publicEnv('PUBLIC_APPLE_STORE_LINK'),
      'process.env.NEXT_PUBLIC_GOOGLE_PLAY_LINK': publicEnv('PUBLIC_GOOGLE_PLAY_LINK'),
      'process.env.NEXT_PUBLIC_EPIC_LINK': publicEnv('PUBLIC_EPIC_LINK'),
      'process.env.NEXT_PUBLIC_STEAM_LINK': publicEnv('PUBLIC_STEAM_LINK'),
      'process.env.NEXT_PUBLIC_FEATURE_FLAGS': publicEnv('PUBLIC_FEATURE_FLAGS'),
    },
  },
})
