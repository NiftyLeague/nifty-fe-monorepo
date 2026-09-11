import type { APIRoute } from 'astro'

const SITE_URL = 'https://niftysmashers.com'

/** Replaces next-sitemap's generated robots.txt. */
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /
Disallow: /api/
Disallow: /invite/

Sitemap: ${SITE_URL}/sitemap.xml
`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600',
      },
    }
  )
