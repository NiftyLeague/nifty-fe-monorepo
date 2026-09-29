import { bindings, defineConfig, triggers } from 'cf/config'

// Deploy source of truth for `cf deploy --prebuilt`. wrangler.jsonc remains
// only for the legacy wrangler path.
export default defineConfig({
  accountId: '90526f277153982742d51be614fb9b40',
  worker: {
    name: 'nifty-unity-cdn',
    compatibilityDate: '2026-08-06',
    entrypoint: 'src/index.ts',
    workersDev: false,
    observability: {
      enabled: true,
    },
    triggers: [
      triggers.fetch({
        pattern: 'cdn.niftyleague.com/unity/*',
        zone: 'niftyleague.com',
      }),
    ],
    env: {
      BUCKET: bindings.r2({ name: 'nifty-league' }),
    },
  },
})
