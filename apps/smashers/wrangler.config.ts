import { defineWranglerConfig } from 'wrangler/experimental-config'

// Tooling-side settings for the cf deploy path; the worker itself is
// configured in cloudflare.config.ts.
export default defineWranglerConfig({
  assetsDirectory: './dist/client',
})
