export function GET() {
  const paths = [
    '/careers',
    '/community',
    '/compete-and-earn',
    '/degens',
    '/disclaimer',
    '/games',
    '/lore',
    '/niftyworld',
    '/overview',
    '/',
    '/privacy-policy',
    '/roadmap',
    '/team',
    '/terms-of-service',
  ]
  const entries = paths
    .map((path) => `<url><loc>https://niftyleague.com${path}</loc></url>`)
    .join('')
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  )
}
