import { createFileRoute } from '@tanstack/react-router'

import { renderRobotsTxt } from '@/server/seo'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(renderRobotsTxt(), {
          headers: { 'content-type': 'text/plain; charset=utf-8' },
        }),
    },
  },
})
