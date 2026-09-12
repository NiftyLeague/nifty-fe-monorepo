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

    expect(SITEMAP_ENTRIES).toHaveLength(16)
    expect(new Set(urls).size).toBe(SITEMAP_ENTRIES.length)
    expect(urls).toContain(`${APP_ORIGIN}/dashboard`)
    expect(urls).toContain(`${APP_ORIGIN}/mint-o-matic`)
    expect(SITEMAP_ENTRIES.every(({ priority }) => priority > 0 && priority <= 1)).toBe(true)
  })

  it('renders a urlset with one entry per canonical route', () => {
    const xml = renderSitemapXml(new Date('2026-01-02T03:04:05Z'))

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml).toContain(`<loc>${APP_ORIGIN}/dashboard</loc>`)
    expect(xml).toContain('<lastmod>2026-01-02</lastmod>')
    expect(xml.match(/<url>/g)).toHaveLength(SITEMAP_ENTRIES.length)
  })
})
