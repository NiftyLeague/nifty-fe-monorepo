import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { buildHead, buildMeta } from '../../apps/app/src/runtime/metadata'

/**
 * App SEO surface. The contract is:
 *
 * - every route file passes a canonical `path` into `buildHead`;
 * - `buildHead` turns that path into `<link rel="canonical">` plus a
 *   route-scoped `og:url`;
 * - `/degens/$id` stays a redirect to the catalog, whose canonical is the
 *   clean `/degens` (query-string filtering does not multiply documents);
 * - the sitemap enumerates the parameterized world surfaces from the same
 *   constants the routes validate against, so a new scene or game becomes
 *   crawlable when it becomes routable.
 */

const routesDir = join(process.cwd(), 'apps/app/src/routes')

const routeFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return routeFiles(path)
    return path.endsWith('.tsx') ? [path] : []
  })

describe('app SEO surface', () => {
  it('declares a canonical path in every route head', () => {
    const missing: string[] = []
    for (const file of routeFiles(routesDir)) {
      const source = readFileSync(file, 'utf8')
      if (!source.includes('buildHead(')) continue
      if (!/buildHead\(\{[\s\S]*?\bpath:/.test(source)) missing.push(file)
    }

    expect(missing, `routes without a canonical path: ${missing.join(', ')}`).toEqual([])
  })

  it('keeps /degens/$id a redirect so filtered catalog views do not multiply documents', () => {
    const source = readFileSync(join(routesDir, '_public/degens.$id.tsx'), 'utf8')

    expect(source).toContain('throw redirect')
    expect(source).toContain('/degens?tokenId=')
  })

  it('emits a canonical link and route-scoped og:url only when a path is set', () => {
    const withPath = buildHead({ title: 'Nifty Smashers', path: '/games/smashers' })

    expect(withPath.links).toEqual([
      { rel: 'canonical', href: 'https://app.niftyleague.com/games/smashers' },
    ])
    expect(buildMeta({ title: 'Nifty Smashers', path: '/games/smashers' })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'og:url',
          content: 'https://app.niftyleague.com/games/smashers',
        }),
      ])
    )

    // No path: no canonical claim — surfaces without a stable address must not
    // emit one pointing at the bare origin.
    const withoutPath = buildHead({ title: 'Nifty Smashers' })
    expect(withoutPath.links).toBeUndefined()
    expect(buildMeta({ title: 'Nifty Smashers' })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'og:url', content: 'https://app.niftyleague.com' }),
      ])
    )
  })

  it('enumerates the parameterized world routes in the sitemap from their constants', () => {
    const source = readFileSync(join(process.cwd(), 'apps/app/src/server/seo.ts'), 'utf8')

    expect(source).toContain("from '@/constants/niftyworld-scenes'")
    expect(source).toContain("from '@/constants/niftyworld-games'")
    expect(source).toContain('NIFTY_WORLD_SCENES.map')
    expect(source).toContain('NIFTY_WORLD_GAMES.map')
  })
})
