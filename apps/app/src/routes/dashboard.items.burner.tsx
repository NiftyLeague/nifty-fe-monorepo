import { createFileRoute } from '@tanstack/react-router'

import ComicsBurnerRouteBoundary from '@/pages/dashboard/items/burner/ComicsBurnerRouteBoundary'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/items/burner')({
  head: () => buildHead({ title: 'Comics Burner' }),
  component: ComicsBurnerRouteBoundary,
})
