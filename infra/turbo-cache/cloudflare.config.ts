import { bindings, defineConfig } from 'cf/config'

// Deploy source of truth for `cf deploy --prebuilt`. wrangler.jsonc remains
// only for the legacy wrangler path.
export default defineConfig({
  accountId: '90526f277153982742d51be614fb9b40',
  worker: {
    name: 'nifty-turbo-cache',
    compatibilityDate: '2026-08-06',
    entrypoint: 'src/index.ts',
    workersDev: true,
    observability: {
      enabled: true,
    },
    env: {
      BUCKET: bindings.r2({ name: 'nifty-turbo-cache' }),
    },
  },
})
