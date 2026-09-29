import { bindings, defineConfig } from 'cf/config'

// Route list mirrored from the legacy wrangler.jsonc: requests matching
// these patterns hit the Worker before static assets.
const WORKER_FIRST_ROUTES = [
  '/gltf/*',
  '/invite/*',
  '/party/*',
  '/shells/*',
  '/contact',
  '/shop',
  '/collections',
  '/collections/*',
  '/pages',
  '/pages/*',
  '/products',
  '/products/*',
  '/cart',
  '/cart/*',
  '/account/login',
  '/docs',
  '/docs/*',
  '/app',
  '/niftyverse',
  '/niftyverse/*',
  '/blog',
  '/feedback',
  '/snapshot',
  '/tally',
  '/NFTL/supply',
  '/HUB',
  '/OS',
  '/ME',
  '/BLUR',
  '/d/*',
]

// Deploy source of truth for `cf deploy --prebuilt`. wrangler.jsonc remains
// only for the legacy wrangler path.
export default defineConfig({
  accountId: '90526f277153982742d51be614fb9b40',
  worker: {
    name: 'nifty-league-web-astro',
    compatibilityDate: '2026-09-09',
    compatibilityFlags: ['nodejs_compat', 'nodejs_compat_populate_process_env'],
    entrypoint: 'worker/index.ts',
    workersDev: true,
    observability: {
      enabled: true,
    },
    assets: {
      notFoundHandling: '404-page',
      runWorkerFirst: WORKER_FIRST_ROUTES,
    },
    env: {
      ASSETS: bindings.assets(),
      DEPLOY_ENV: bindings.text('production'),
    },
  },
})
