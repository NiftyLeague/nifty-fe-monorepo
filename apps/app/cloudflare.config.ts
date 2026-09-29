import { bindings, defineConfig } from 'cf/config'

// Deploy source of truth for `cf deploy` (apps/app). wrangler.jsonc remains
// only for the legacy `wrangler dev`/`wrangler deploy` path, which follows
// Nitro's emitted .output/server/wrangler.json redirect.
export default defineConfig({
  accountId: '90526f277153982742d51be614fb9b40',
  worker: {
    name: 'nifty-league-app',
    // Newest runtime the local dev sandbox (miniflare 4.x via nitro's
    // env-runner) supports; production gains nothing from a newer date.
    compatibilityDate: '2026-08-06',
    compatibilityFlags: ['nodejs_compat', 'nodejs_compat_populate_process_env'],
    entrypoint: '.output/server/index.mjs',
    workersDev: true,
    observability: {
      enabled: true,
    },
    placement: {
      mode: 'smart',
    },
    env: {
      ASSETS: bindings.assets(),
    },
  },
})
