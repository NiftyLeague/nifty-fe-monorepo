import { createFileRoute } from '@tanstack/react-router'

import GamerProfileRouteBoundary from '@/pages/dashboard/gamer-profile/GamerProfileRouteBoundary'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/gamer-profile')({
  head: () => buildHead({ title: 'Gamer Profile' }),
  component: GamerProfileRouteBoundary,
})
