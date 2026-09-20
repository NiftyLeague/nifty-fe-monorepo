import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Media cache policy for the smashers Workers deploy. The Cloudflare adapter
 * generates `_headers` with only the immutable `/_astro/*` rule; the media
 * surfaces below keep the refresh policy. `test/contract/cache-surface.test.ts`
 * asserts the policy classes stay declared here.
 */
export const MEDIA_HEADERS = `/img/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800

/icons/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800

/video/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800

/favicon/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
`

const target = join(process.cwd(), 'dist', 'client', '_headers')
let existing = ''
try {
  existing = readFileSync(target, 'utf8')
  if (!existing.endsWith('\n')) existing += '\n'
} catch {
  // No adapter-generated file; start fresh.
}
if (!existing.includes('/img/*')) writeFileSync(target, existing + MEDIA_HEADERS)
console.log('[append-headers] media rules merged into dist/client/_headers')
