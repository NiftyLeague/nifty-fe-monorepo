import { bindings, defineConfig } from 'cf/config'

// Deploy source of truth for `cf deploy --prebuilt`. wrangler.jsonc and
// astro.wrangler.jsonc (read by the Astro adapter at build time) remain for
// the legacy wrangler path.
export default defineConfig({
  accountId: '90526f277153982742d51be614fb9b40',
  worker: {
    name: 'nifty-league-smashers',
    compatibilityDate: '2026-09-09',
    compatibilityFlags: [
      'nodejs_compat',
      'nodejs_compat_populate_process_env',
      'global_fetch_strictly_public',
    ],
    entrypoint: 'dist/server/entry.mjs',
    workersDev: true,
    observability: {
      enabled: true,
    },
    env: {
      ASSETS: bindings.assets(),
    },
  },
})
