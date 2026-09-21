import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Writes the Workers Static Assets control files into dist after the Astro
// build. `_redirects` carries the legacy slugs that are not prefixed with the
// /docs base (those are redirected by worker/index.ts); `_headers` keeps the
// immutable-hash and day-long media cache rules. The /docs base-prefix strip
// itself is done by the worker, because Workers Assets `_redirects` does not
// interpolate placeholders in 200-rewrite destinations.
export const REDIRECTS = `# Retired slugs first: _redirects matches top-down.
/archive/rentals/rentals https://niftyleague.com/docs/archive/rentals 301
/overview/games/niftyworld/niftyworld https://niftyleague.com/docs/overview/games/niftyworld 301
/greetings https://niftyleague.com/docs 301
/tutorial https://niftyleague.com/docs 301
/tutorial/:path* https://niftyleague.com/docs 301
`

export const HEADERS = `/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/docs/_astro/*
  Cache-Control: public, max-age=31536000, immutable
/docs/img/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/docs/video/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/docs/favicon/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/img/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/video/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
/favicon/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
`

writeFileSync(join(process.cwd(), 'dist', '_redirects'), REDIRECTS)
writeFileSync(join(process.cwd(), 'dist', '_headers'), HEADERS)
