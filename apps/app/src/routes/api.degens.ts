import { createFileRoute } from '@tanstack/react-router'

import { GET } from '@/server/degens'

export const Route = createFileRoute('/api/degens')({
  server: {
    handlers: { GET: ({ request }) => GET(request) },
  },
})
