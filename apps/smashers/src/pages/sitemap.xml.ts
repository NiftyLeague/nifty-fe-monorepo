import type { APIRoute } from 'astro'

const SITE_URL = 'https://niftysmashers.com'

const HIGH_PRIORITY_PATHS = ['/']
const MID_PRIORITY_PATHS = ['/android', '/ios', '/epic', '/steam', '/loot']
const LOW_PRIORITY_PATHS = ['/login', '/profile']
const ALL_PATHS = [...HIGH_PRIORITY_PATHS, ...MID_PRIORITY_PATHS, ...LOW_PRIORITY_PATHS]

const pathPriority = (path: string): string => {
  if (HIGH_PRIORITY_PATHS.includes(path)) return '1.0'
  if (MID_PRIORITY_PATHS.includes(path)) return '0.7'
  return '0.4'
}

/**
 * Static sitemap, replacing the next-sitemap postbuild step. The path list is
 * preserved exactly, including the store redirects that are not Astro pages but
 * are still worth submitting.
 */
export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString()
  const urls = ALL_PATHS.map(
    (path) => `  <url>
    <loc>${new URL(path, SITE_URL).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${pathPriority(path)}</priority>
  </url>`
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
