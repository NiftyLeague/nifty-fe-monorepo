import { describe, expect, it } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Docs SEO surface contract: head-tag hygiene and crawlability
 * guarantees for apps/docs. Source-level by design — every guarantee here is
 * enforced where the tags are produced, so a regression fails without needing a
 * built dist.
 *
 */

const docsRoot = join(process.cwd(), 'apps/docs')
const read = (...parts: string[]) => readFileSync(join(docsRoot, ...parts), 'utf8')

describe('docs SEO surface', () => {
  it('keeps the Head override as the single emitter of the tags it owns', () => {
    const head = read('src/components/starlight/Head.astro')

    // The override must drop Starlight's generated copies of the tags it
    // re-emits, and the opensearch link whose duplicate it also renders.
    expect(head).toContain(
      "OVERRIDDEN = new Set(['og:url', 'og:image', 'twitter:card', 'twitter:image'])"
    )
    expect(head).toContain("attrs?.rel === 'search' || attrs?.rel === 'canonical'")

    // The canonical/OG/Twitter tags themselves must stay in the override, with
    // absolute social-image URLs (the old config-head copy was relative and
    // broke scrapers).
    expect(head).toContain('rel="canonical"')
    expect(head).toContain('property="og:image"')
    expect(head).toContain('name="twitter:card"')
    expect(head).not.toMatch(/content=['"]img\//)

    // The astro config head must not re-add the tags the override owns.
    const config = read('astro.config.mjs')
    expect(config).not.toContain('og:image')
    expect(config).not.toContain('twitter:card')
    expect(config).not.toContain('opensearchdescription')
  })

  it('preloads the roadmap LCP image through the shared pipeline constants', () => {
    // The preload (Head.astro) and the <Image> (roadmap.mdx) must resolve the
    // same hashed variants, so both sides must consume the same constants —
    // separate literals would drift and preload files the srcset never picks.
    const shared = read('src/lib/roadmap-poster.ts')
    for (const constant of [
      'ROADMAP_POSTER_WIDTHS',
      'ROADMAP_POSTER_SIZES',
      'ROADMAP_POSTER_FORMAT',
      'ROADMAP_POSTER_QUALITY',
    ]) {
      expect(shared).toContain(constant)
    }
    expect(shared).toMatch(/import roadmapPoster from/)

    const head = read('src/components/starlight/Head.astro')
    expect(head).toContain("from '../../lib/roadmap-poster'")
    expect(head).toMatch(/rel="preload"[\s\S]{0,80}as="image"[\s\S]{0,200}imagesrcset/)
    expect(head).toContain("entry.id === 'overview/roadmap'")

    const mdx = read('src/content/docs/overview/roadmap.mdx')
    expect(mdx).toContain("from '../../../lib/roadmap-poster'")
    // No inline variant literals: widths must come from the shared module.
    expect(mdx).not.toMatch(/widths=\{\[\d/)
  })

  it('serves a domain-root robots.txt that points at the sitemap index', () => {
    const robots = read('src/pages/robots.txt.ts')
    expect(robots).toContain('Sitemap: https://docs.niftyleague.com/sitemap-index.xml')
    expect(robots).toContain('Allow: /')
  })

  it('keeps the Algolia crawler config pointed at the live sitemap URL', () => {
    // The crawler config's sitemap_urls must reference the URL robots.txt
    // declares.
    const algolia = JSON.parse(read('algolia-config.json')) as { sitemap_urls: string[] }
    expect(algolia.sitemap_urls).toEqual(['https://docs.niftyleague.com/sitemap-index.xml'])
  })

  it('keeps the utility search page out of the index', () => {
    const head = read('src/components/starlight/Head.astro')
    expect(head).toContain('isSearchPage && <meta name="robots" content="noindex"')
  })

  it('ships no search code outside the lazy DocSearch chunk', () => {
    // DocSearch is the largest script on the site and loads on the first
    // interaction (plus hover/focus warm-up); a static import anywhere in src
    // would put it back on the critical path of every content page. Type-only
    // imports are erased and `?url` imports resolve to a build-time string —
    // neither ships runtime code.
    const search = read('src/components/starlight/Search.astro')
    expect(search).toContain("import('@docsearch/js/docsearch')")
    expect(search).toMatch(/pointerenter|focus/)

    const staticImport =
      /\bimport\s(?!type\b)(?:[\w$]+|{[^}]*})\s+from\s+['"]@docsearch\/(?![^'"]*\?url)['"]/
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) walk(path)
        else if (
          /\.(astro|ts|tsx|mdx)$/.test(entry.name) &&
          staticImport.test(readFileSync(path, 'utf8'))
        )
          offenders.push(path)
      }
    }
    walk(join(docsRoot, 'src'))
    expect(offenders, 'static @docsearch imports found').toEqual([])
  })
})
