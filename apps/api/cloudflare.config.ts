import { defineConfig } from 'cf/config'

// Deploy source of truth for `cf deploy --prebuilt`. wrangler.jsonc remains
// only for the legacy wrangler path.
export default defineConfig({
  accountId: '90526f277153982742d51be614fb9b40',
  worker: {
    name: 'nifty-league-api',
    compatibilityDate: '2026-09-09',
    compatibilityFlags: [
      'nodejs_compat',
      'nodejs_compat_populate_process_env',
      'global_fetch_strictly_public',
    ],
    entrypoint: 'src/worker.ts',
    workersDev: true,
    observability: {
      enabled: true,
    },
    placement: {
      mode: 'smart',
    },
  },
})
