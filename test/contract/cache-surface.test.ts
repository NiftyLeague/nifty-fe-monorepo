import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Cache-surface contract (#1886): the Cache-Control each app declares per route
 * class. The checks read the declared configuration (vercel.json headers and
 * web's Workers `_headers` file), which is what production serves — the live
 * values were verified with curl evidence during the M5.5–M5.8 audits, and
 * `scripts/cache-probe.mjs` re-captures that evidence on demand.
 *
 * Route classes: hashed immutable assets (`/_astro/*`, `/assets/*`, `/__images/*`),
 * refreshed media (`/img`, `/icons`, `/video`, `/favicon`), and HTML (platform
 * default `public, max-age=0, must-revalidate` — correct for SSR and ETag-gated
 * static pages; never configured immutable).
 */

const IMMUTABLE = 'public, max-age=31536000, immutable'
const REFRESH = 'public, max-age=86400, stale-while-revalidate=604800'

type HeaderBlock = { source: string; headers: { key: string; value: string }[] }
const readVercel = (app: string) => {
  const config = JSON.parse(readFileSync(join('apps', app, 'vercel.json'), 'utf8')) as {
    headers?: HeaderBlock[]
  }
  return Object.fromEntries(
    (config.headers ?? []).map((block) => [
      block.source.replace('/(.*)', '/*').replace('/:path*', '/*'),
      Object.fromEntries(block.headers.map(({ key, value }) => [key.toLowerCase(), value])),
    ])
  )
}

describe('cache surfaces', () => {
  it('declares immutable caching for every hashed-asset route class', () => {
    const hashed = [
      ['web', '/_astro/*'],
      ['web', '/__images/*'],
      ['app', '/assets/*'],
      ['smashers', '/_astro/*'],
      // Docs builds under the /docs base, so the URL surface its HTML references
      // is /docs/_astro/*; the bare /_astro/* twin serves the same files through
      // the vercel.json rewrite and must keep the identical policy (#1884). The
      // bare-only declaration was the M5.7 audit's cache finding: every hashed
      // asset revalidated per visit because the prefixed path matched nothing.
      ['docs', '/docs/_astro/*'],
      ['docs', '/_astro/*'],
    ] as const
    for (const [app, source] of hashed) {
      const headers = readVercel(app)[source]
      expect(headers, `${app} ${source} has no cache headers`).toBeDefined()
      expect(headers['cache-control'], `${app} ${source}`).toBe(IMMUTABLE)
    }
  })

  it('keeps docs media on the refresh policy instead of the platform default', () => {
    // Both URL forms serve the shared assets directory: the prefixed build-base
    // form is what every page references, the bare form is its rewrite twin.
    const headers = readVercel('docs')
    for (const source of [
      '/docs/img/*',
      '/docs/video/*',
      '/docs/favicon/*',
      '/img/*',
      '/video/*',
      '/favicon/*',
    ]) {
      expect(headers[source]?.['cache-control'], `docs ${source}`).toBe(REFRESH)
      expect(headers[source]?.['cache-control'], `docs ${source}`).not.toBe(IMMUTABLE)
    }
  })

  it('keeps web media on the refresh policy instead of immutable', () => {
    const headers = readVercel('web')
    for (const source of ['/img/*', '/icons/*', '/video/*', '/favicon/*']) {
      expect(headers[source]?.['cache-control'], `web ${source}`).toBe(REFRESH)
    }
    // Refreshable media must never be marked immutable — the revalidate window
    // is the point.
    for (const source of ['/img/*', '/icons/*', '/video/*', '/favicon/*']) {
      expect(headers[source]?.['cache-control']).not.toBe(IMMUTABLE)
    }
  })

  it('keeps smashers media on the refresh policy instead of the platform default', () => {
    // The public/ media (hero posters, videos, favicons, icons) rode Vercel's
    // `max-age=0, must-revalidate` default until the M5.6 audit (#1883) gave
    // smashers the same refresh policy as web.
    const headers = readVercel('smashers')
    for (const source of ['/img/*', '/icons/*', '/video/*', '/favicon/*']) {
      expect(headers[source]?.['cache-control'], `smashers ${source}`).toBe(REFRESH)
      expect(headers[source]?.['cache-control'], `smashers ${source}`).not.toBe(IMMUTABLE)
    }
  })

  it('keeps smashers session-bound API payloads explicitly uncacheable', () => {
    // Vercel stamps `public, max-age=0, must-revalidate` on function responses
    // with no explicit policy — `public` invites shared-cache storage of
    // per-user data. The shared `json()` helper is the single response path for
    // every playfab/auth endpoint; `edge-geo` answers per caller geo.
    const session = readFileSync(join('apps/smashers/src/utils/session.ts'), 'utf8')
    const jsonHelper = session.slice(session.indexOf('export const json'))
    expect(jsonHelper).toContain("'Cache-Control': 'no-store'")
    const edgeGeo = readFileSync(join('apps/smashers/src/pages/api/edge-geo.ts'), 'utf8')
    expect(edgeGeo).toContain("'cache-control': 'no-store'")
  })

  it('keeps the Workers headers file in sync with web', () => {
    // The static-headers module is the Cloudflare surface source; the sync check
    // with vercel.json lives in vercel-build-policy.test.ts. Here: the file the
    // finalize script writes must exist and carry both asset classes.
    const gate = join('apps/web/scripts/static-headers.mjs')
    expect(existsSync(gate)).toBe(true)
    const headersFile = readFileSync(gate, 'utf8')
    expect(headersFile).toContain('/_astro/*')
    expect(headersFile).toContain('public, max-age=31536000, immutable')
    expect(headersFile).toContain('/__images/*')
  })

  it('leaves HTML on the revalidating default (never immutable)', () => {
    for (const app of ['web', 'app', 'smashers', 'docs']) {
      const htmlBlocks = Object.entries(readVercel(app)).filter(([source]) => source === '/*')
      for (const [, headers] of htmlBlocks) {
        // No explicit HTML policy is the Vercel default (max-age=0, must-revalidate);
        // the assertion only rejects an explicitly immutable HTML declaration.
        expect(headers['cache-control'] ?? 'must-revalidate', `${app} HTML`).not.toContain(
          'immutable'
        )
      }
    }
  })
})
