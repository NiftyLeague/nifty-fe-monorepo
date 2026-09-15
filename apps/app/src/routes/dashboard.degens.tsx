import { createFileRoute } from '@tanstack/solid-router'

import DashboardDegensRouteBoundary from '@/pages/dashboard/degens/DashboardDegensRouteBoundary'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/degens')({
  head: () => buildHead({ path: '/dashboard/degens', title: 'My DEGENs' }),
  component: DashboardDegensRouteBoundary,
})
