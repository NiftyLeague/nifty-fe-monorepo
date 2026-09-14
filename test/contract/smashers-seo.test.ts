import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ALL_PATHS } from '../../apps/smashers/src/pages/sitemap.xml'

/**
 * SEO surface contract for apps/smashers.
 *
 * The sitemap and the metadata surface must agree: every submitted URL must be
 * indexable. `/login` and `/profile` render through Auth.astro's `noindex`
 * default, so they are excluded from the sitemap.
 */

const SMASHERS = 'apps/smashers'
const read = (path: string) => readFileSync(join(SMASHERS, path), 'utf8')

/** The store deep links are endpoints, not pages; everything else is a page. */
const ENDPOINT_PATHS = ['/android', '/epic', '/ios', '/steam']
const PAGE_PATHS = ALL_PATHS.filter((path) => !ENDPOINT_PATHS.includes(path))

const pageFile = (path: string) =>
  join(SMASHERS, 'src/pages', path === '/' ? 'index.astro' : `${path}.astro`)

describe('smashers SEO surface', () => {
  it('keeps the noindex surfaces out of the sitemap', () => {
    const authLayout = read('src/layouts/Auth.astro')
    expect(authLayout, 'Auth.astro defaults to noindex').toContain('noindex: true')
    for (const path of ['/login', '/profile']) {
      expect(ALL_PATHS, `${path} is noindex and must not be submitted`).not.toContain(path)
      const page = read(`src/pages${path}.astro`)
      expect(page, `${path} renders through the noindex auth layout`).toContain('Auth')
      expect(page, `${path} must not opt back into indexing`).not.toContain('noindex: false')
    }
  })

  it('keeps every sitemap entry backed by a real route', () => {
    for (const path of PAGE_PATHS) {
      expect(existsSync(pageFile(path)), pageFile(path)).toBe(true)
    }
    for (const path of ENDPOINT_PATHS) {
      expect(
        existsSync(join(SMASHERS, 'src/pages', path.slice(1), '[...path].ts')),
        `${path}/[...path].ts`
      ).toBe(true)
    }
  })

  it('keeps the crawlable surfaces on unique titles', () => {
    // `/` uses the default title; `/loot` sets its own. Both canonical paths are
    // explicit, so query strings (the home page's ?referral=) never leak in.
    const home = read('src/pages/index.astro')
    const loot = read('src/pages/loot.astro')
    expect(loot).toMatch(/title:\s*'Loot'/)
    for (const page of [home, loot]) {
      expect(page).toMatch(/canonical=/)
    }
  })
})
