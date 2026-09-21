import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Cache-surface contract: the Cache-Control each app declares per route
 * class. The checks read the declared sources — the `_headers` modules whose
 * content the builds write into each Worker's assets output — which is what
 * production serves; the live values can be re-captured with
 * `scripts/cache-probe.mjs` when needed.
 *
 * Route classes: hashed immutable assets (`/_astro/*`, `/assets/*`,
 * `/__images/*`), refreshed media (`/img`, `/icons`, `/video`, `/favicon`),
 * and HTML (platform default `public, max-age=0, must-revalidate` — correct
 * for SSR and ETag-gated static pages; never configured immutable).
 */

const IMMUTABLE = 'public, max-age=31536000, immutable'
const REFRESH = 'public, max-age=86400, stale-while-revalidate=604800'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')
const webHeaders = () => read('apps/web/scripts/static-headers.mjs')
const appHeaders = () => read('apps/app/scripts/headers-content.mjs')
const docsHeaders = () => read('apps/docs/scripts/static-files.mjs')
const smashersHeaders = () => read('apps/smashers/scripts/append-headers.mjs')

const htmlBlockCacheControl = (content: string): string | undefined => {
  const blocks = content.split('\n\n')
  const root = blocks.find((block) => block.split('\n')[0].trim() === '/*')
  return root
    ?.split('\n')
    .find((line) => line.trim().startsWith('Cache-Control:'))
    ?.split(':')[1]
    ?.trim()
}

describe('cache surfaces', () => {
  it('declares immutable caching for every hashed-asset route class', () => {
    const hashed: [string, () => string, string][] = [
      ['web', webHeaders, '/_astro/*'],
      ['web', webHeaders, '/__images/*'],
      ['app', appHeaders, '/assets/*'],
      // The app's build-time image variants are content-addressed like the
      // hashed chunks, so they take the same immutable policy.
      ['app', appHeaders, '/__images/*'],
      // Docs builds under the /docs base, so the URL surface its HTML references
      // is /docs/_astro/*; the bare /_astro/* twin serves the same files through
      // the worker's prefix strip and must keep the identical policy.
      ['docs', docsHeaders, '/docs/_astro/*'],
      ['docs', docsHeaders, '/_astro/*'],
    ]
    for (const [app, source, route] of hashed) {
      const content = source()
      expect(content.includes(route), `${app} ${route}`).toBe(true)
      expect(content, `${app} ${route}`).toContain(IMMUTABLE)
    }
  })

  it('keeps docs media on the refresh policy instead of the platform default', () => {
    // Both URL forms serve the shared assets directory: the prefixed build-base
    // form is what every page references, the bare form is its worker-strip twin.
    const headers = docsHeaders()
    for (const source of [
      '/docs/img/*',
      '/docs/video/*',
      '/docs/favicon/*',
      '/img/*',
      '/video/*',
      '/favicon/*',
    ]) {
      expect(headers.includes(source), `docs ${source}`).toBe(true)
    }
    expect(headers.includes(REFRESH)).toBe(true)
    expect(headers.includes(IMMUTABLE.replace('31536000', '86400'))).toBe(false)
  })

  it('keeps web media on the refresh policy instead of immutable', () => {
    const headers = webHeaders()
    for (const source of ['/img/*', '/icons/*', '/video/*', '/favicon/*']) {
      expect(headers.includes(source), `web ${source}`).toBe(true)
    }
    expect(headers.includes(REFRESH)).toBe(true)
  })

  it('keeps smashers media on the refresh policy instead of the platform default', () => {
    // The public/ media (hero posters, videos, favicons, icons) uses the same
    // refresh policy as web.
    const headers = smashersHeaders()
    for (const source of ['/img/*', '/icons/*', '/video/*', '/favicon/*']) {
      expect(headers.includes(source), `smashers ${source}`).toBe(true)
    }
    expect(headers.includes(REFRESH)).toBe(true)
  })

  it('keeps app media on the refresh policy instead of the platform default', () => {
    // The app shares the repo-root assets dir as its public surface and uses an
    // explicit refresh policy for its media.
    const headers = appHeaders()
    for (const source of ['/img/*', '/icons/*', '/video/*', '/favicon/*']) {
      expect(headers.includes(source), `app ${source}`).toBe(true)
    }
    expect(headers.includes(REFRESH)).toBe(true)
  })

  it('keeps smashers session-bound API payloads explicitly uncacheable', () => {
    // SSR function responses with no explicit policy default to shared-cache
    // friendly staleness — `public` invites shared-cache storage of per-user
    // data. The shared `json()` helper is the single response path for every
    // playfab/auth endpoint; `edge-geo` answers per caller geo.
    const session = readFileSync(join('apps/smashers/src/utils/session.ts'), 'utf8')
    const jsonHelper = session.slice(session.indexOf('export const json'))
    expect(jsonHelper).toContain("'Cache-Control': 'no-store'")
    const edgeGeo = readFileSync(join('apps/smashers/src/pages/api/edge-geo.ts'), 'utf8')
    expect(edgeGeo).toContain("'cache-control': 'no-store'")
  })

  it('leaves HTML on the revalidating default (never immutable)', () => {
    // Parse the `_headers` blocks and check the exact `/*` (HTML) block: no
    // Cache-Control at all is the correct revalidating default, and an
    // immutable declaration would poison every page.
    for (const [app, headers] of [
      ['web', webHeaders()],
      ['app', appHeaders()],
      ['docs', docsHeaders()],
    ] as const) {
      const policy = htmlBlockCacheControl(headers)
      expect(policy ?? 'must-revalidate', `${app} HTML`).not.toContain('immutable')
    }
  })

  it('pins the Worker response policies for deep-link shells', () => {
    const worker = readFileSync(join('apps', 'web', 'worker', 'index.ts'), 'utf8')

    expect(worker).toContain("response.headers.set('Cache-Control', 'no-store')")
    expect(worker).toContain("response.headers.set('X-Robots-Tag', 'noindex, nofollow')")
    expect(worker).toContain(
      "response.headers.set('Cache-Control', 'public, max-age=0, s-maxage=3600')"
    )
  })
})
