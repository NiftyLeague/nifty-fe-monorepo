import type { APIRoute } from 'astro'

const SITE_URL = 'https://niftysmashers.com'

const HIGH_PRIORITY_PATHS = ['/']
const MID_PRIORITY_PATHS = ['/loot']
export const ALL_PATHS = [...HIGH_PRIORITY_PATHS, ...MID_PRIORITY_PATHS]

const pathPriority = (path: string): string => {
  if (HIGH_PRIORITY_PATHS.includes(path)) return '1.0'
  return '0.7'
}

/**
 * Static sitemap, replacing the next-sitemap postbuild step. Only indexable
 * pages belong here: `/android`, `/ios`, `/epic` and `/steam` are outbound
 * store redirects (Search Console reports them as "Page with redirect"), and
 * `/login` and `/profile` render `noindex` (Auth.astro).
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
