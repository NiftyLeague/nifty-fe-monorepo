import { createFileRoute } from '@tanstack/react-router'

import DashboardItemsRouteBoundary from '@/pages/dashboard/items/DashboardItemsRouteBoundary'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/items')({
  head: () => buildHead({ path: '/dashboard/items', title: 'My Items' }),
  component: DashboardItemsRouteBoundary,
})
