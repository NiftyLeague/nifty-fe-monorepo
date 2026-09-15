import { createFileRoute } from '@tanstack/solid-router'

import ComicsBurnerRouteBoundary from '@/pages/dashboard/items/burner/ComicsBurnerRouteBoundary'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/items/burner')({
  head: () => buildHead({ path: '/dashboard/items/burner', title: 'Comics Burner' }),
  component: ComicsBurnerRouteBoundary,
})
