/**
 * Cache and CORS policy for the app's static asset routes on the Workers
 * deploy. Nitro's generated `_headers` only covers `/assets/*`; this module
 * carries the rest of the route classes, and `post-build-worker.mjs` merges
 * it into `.output/public/_headers`. `test/contract/cache-surface.test.ts`
 * asserts the policy classes stay declared here.
 */
/**
 * Security headers the old platform config applied to every response. Static
 * assets get them through the `/*` block in ASSET_HEADERS; SSR responses get
 * them through nitro routeRules in vite.config.ts, which imports this module
 * so the values stay in exactly one place.
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

export const ASSET_HEADERS = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=31536000, immutable

/__images/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800

/icons/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800

/video/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800

/favicon/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
`
