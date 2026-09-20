/**
 * Cache and CORS policy for the app's static asset routes on the Workers
 * deploy. Nitro's generated `_headers` only covers `/assets/*`; this module
 * carries the rest of the route classes, and `post-build-worker.mjs` merges
 * it into `.output/public/_headers`. `test/contract/cache-surface.test.ts`
 * asserts the policy classes stay declared here.
 */
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
