import { NIFTY_WORLD_GAMES } from '@/constants/niftyworld-games'
import { NIFTY_WORLD_SCENES } from '@/constants/niftyworld-scenes'

export const APP_ORIGIN = 'https://app.niftyleague.com'

// Static surfaces plus the parameterized Nifty World routes, enumerated from
// the same constants the routes validate against so a new scene/game becomes
// crawlable when it becomes routable (M5.8 audit, #1885: the /world launch
// shipped without any sitemap entries).
const worldEntries = [
  { priority: 0.8, path: '/world' },
  ...NIFTY_WORLD_SCENES.map((scene) => ({
    priority: 0.7,
    path: `/world/niftyworld/${scene.id}`,
  })),
  ...NIFTY_WORLD_GAMES.map((game) => ({
    priority: 0.7,
    path: `/games/niftyworld/${game.id}`,
  })),
]

export const SITEMAP_ENTRIES = [
  { priority: 1.0, path: '' },
  { priority: 0.8, path: '/dashboard' },
  { priority: 0.8, path: '/dashboard/degens' },
  { priority: 0.8, path: '/dashboard/gamer-profile' },
  { priority: 0.8, path: '/dashboard/items' },
  { priority: 0.8, path: '/dashboard/overview' },
  { priority: 0.5, path: '/dashboard/rentals' },
  { priority: 0.8, path: '/degens' },
  { priority: 0.8, path: '/games' },
  { priority: 0.8, path: '/games/crypto-winter' },
  { priority: 0.8, path: '/games/mt-gawx' },
  { priority: 0.8, path: '/games/smashers' },
  { priority: 0.8, path: '/games/wen-game' },
  { priority: 0.8, path: '/leaderboards' },
  { priority: 0.8, path: '/mint-o-matic' },
  { priority: 0.5, path: '/verification' },
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
