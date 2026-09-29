import { bindings, defineConfig } from 'cf/config'

// Deploy source of truth for `cf deploy --prebuilt`. wrangler.jsonc remains
// only for the legacy wrangler path.
export default defineConfig({
  accountId: '90526f277153982742d51be614fb9b40',
  worker: {
    name: 'nifty-league-docs',
    compatibilityDate: '2026-09-09',
    compatibilityFlags: ['nodejs_compat', 'nodejs_compat_populate_process_env'],
    entrypoint: 'worker/index.ts',
    workersDev: true,
    observability: {
      enabled: true,
    },
    assets: {
      htmlHandling: 'drop-trailing-slash',
      notFoundHandling: '404-page',
      runWorkerFirst: ['/docs', '/docs/*'],
    },
    env: {
      ASSETS: bindings.assets(),
    },
  },
})
