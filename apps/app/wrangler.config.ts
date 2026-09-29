import { defineWranglerConfig } from 'wrangler/experimental-config'

// Tooling-side settings for the cf deploy path. The Nitro build already
// bundles the worker; cf must not re-bundle it.
export default defineWranglerConfig({
  noBundle: true,
  assetsDirectory: './.output/public',
  // Build command for the wrangler dev delegate; production deploys run
  // `bun run deploy` (turbo build + cf-wrangler build + cf deploy --prebuilt).
  build: {
    command: 'bun run cf:build',
  },
  rules: [
    {
      type: 'ESModule',
      globs: ['**/*.mjs', '**/*.js'],
    },
  ],
})
