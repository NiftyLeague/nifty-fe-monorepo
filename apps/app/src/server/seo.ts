import { NIFTY_WORLD_GAMES } from '@/constants/niftyworld-games'
import { NIFTY_WORLD_SCENES } from '@/constants/niftyworld-scenes'

export const APP_ORIGIN = 'https://app.niftyleague.com'

const worldEntries = [
  { priority: 0.8, path: '/world' },
  ...NIFTY_WORLD_SCENES.map((scene) => ({
    priority: 0.7,
    path: `/world/${scene.id}`,
  })),
  ...NIFTY_WORLD_GAMES.map((game) => ({
    priority: 0.7,
    path: `/games/${game.id}`,
  })),
]

// Only publicly indexable routes belong here: /dashboard/* sits behind
// AuthGuard (anonymous crawlers get the login wall) and /verification renders
// a client-only wallet check, so neither can be indexed.
export const SITEMAP_ENTRIES = [
  { priority: 1.0, path: '' },
  { priority: 0.8, path: '/degens' },
  { priority: 0.8, path: '/games' },
  { priority: 0.8, path: '/games/smashers' },
  { priority: 0.8, path: '/leaderboards' },
  { priority: 0.8, path: '/mint-o-matic' },
  ...worldEntries,
] as const

/** Crawler rules, published verbatim at `/robots.txt`. */
export const ROBOTS = {
  rules: { userAgent: '*', allow: '/', disallow: '/private/' },
  sitemap: `${APP_ORIGIN}/sitemap.xml`,
} as const

export const renderRobotsTxt = (): string => {
  const { userAgent, allow, disallow } = ROBOTS.rules
  return [
    `User-agent: ${userAgent}`,
    `Allow: ${allow}`,
    `Disallow: ${disallow}`,
    `Sitemap: ${ROBOTS.sitemap}`,
    '',
  ].join('\n')
}

export const renderSitemapXml = (lastModified = new Date()): string => {
  const lastmod = lastModified.toISOString().split('T')[0]

  const urls = SITEMAP_ENTRIES.map(({ path, priority }) =>
    [
      '  <url>',
      `    <loc>${APP_ORIGIN}${path}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '    <changefreq>yearly</changefreq>',
      `    <priority>${priority.toFixed(1)}</priority>`,
      '  </url>',
    ].join('\n')
  )

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}
