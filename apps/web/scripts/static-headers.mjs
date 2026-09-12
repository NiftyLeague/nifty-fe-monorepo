/**
 * Response headers for the Cloudflare Workers assets surface (`wrangler.jsonc`
 * assets.directory = ./dist, which consumes a `_headers` file) — written into the
 * build output by `finalize-static.mjs`.
 *
 * Production today is Vercel, whose source of truth is `apps/web/vercel.json`; this
 * file is the same contract expressed for the Worker surface the E2E suite runs
 * against. `test/contract/vercel-build-policy.test.ts` asserts the two stay in
 * sync, so a header added to one platform cannot silently miss the other.
 */
export const HEADERS_FILE = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000

/_astro/*
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
