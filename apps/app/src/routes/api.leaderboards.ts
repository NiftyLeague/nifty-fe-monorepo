import { createFileRoute } from '@tanstack/solid-router'

import { GET } from '@/server/leaderboards'

export const Route = createFileRoute('/api/leaderboards')({
  server: {
    handlers: { GET: ({ request }) => GET(request) },
  },
})
