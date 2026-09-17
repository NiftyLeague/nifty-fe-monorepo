import { describe, expect, it } from 'bun:test'

import { APP_ORIGIN, ROBOTS, SITEMAP_ENTRIES, renderRobotsTxt, renderSitemapXml } from './seo'

describe('application metadata routes', () => {
  it('publishes crawler rules and the canonical sitemap URL', () => {
    expect(ROBOTS).toEqual({
      rules: { userAgent: '*', allow: '/', disallow: '/private/' },
      sitemap: `${APP_ORIGIN}/sitemap.xml`,
    })

    expect(renderRobotsTxt()).toBe(
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /private/',
        `Sitemap: ${APP_ORIGIN}/sitemap.xml`,
        '',
      ].join('\n')
    )
  })

  it('lists unique canonical routes with valid priorities', () => {
    const urls = SITEMAP_ENTRIES.map(({ path }) => `${APP_ORIGIN}${path}`)

    // 7 public static surfaces plus the /world index, 9 scenes, and 6 mini
    // games. Auth-gated (/dashboard/*) and client-only (/verification) routes
    // are deliberately absent.
    expect(SITEMAP_ENTRIES).toHaveLength(23)
    expect(new Set(urls).size).toBe(SITEMAP_ENTRIES.length)
    expect(urls).not.toContain(`${APP_ORIGIN}/dashboard`)
    expect(urls).not.toContain(`${APP_ORIGIN}/verification`)
    expect(urls).toContain(`${APP_ORIGIN}/mint-o-matic`)
    expect(urls).toContain(`${APP_ORIGIN}/world`)
    expect(urls).toContain(`${APP_ORIGIN}/world/isla-azul`)
    expect(urls).toContain(`${APP_ORIGIN}/games/degen-dodge`)
    expect(SITEMAP_ENTRIES.every(({ priority }) => priority > 0 && priority <= 1)).toBe(true)
  })

  it('renders a urlset with one entry per canonical route', () => {
    const xml = renderSitemapXml(new Date('2026-01-02T03:04:05Z'))

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml).toContain(`<loc>${APP_ORIGIN}/games</loc>`)
    expect(xml).not.toContain(`${APP_ORIGIN}/dashboard`)
    expect(xml).toContain('<lastmod>2026-01-02</lastmod>')
    expect(xml.match(/<url>/g)).toHaveLength(SITEMAP_ENTRIES.length)
  })
})
