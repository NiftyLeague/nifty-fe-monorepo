import { createFileRoute } from '@tanstack/solid-router'

import { renderSitemapXml } from '@/server/seo'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(renderSitemapXml(), {
          headers: { 'content-type': 'application/xml; charset=utf-8' },
        }),
    },
  },
})
