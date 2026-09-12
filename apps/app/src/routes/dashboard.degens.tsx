import { createFileRoute } from '@tanstack/react-router'

import DashboardDegensRouteBoundary from '@/pages/dashboard/degens/DashboardDegensRouteBoundary'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/degens')({
  head: () => buildHead({ title: 'My DEGENs' }),
  component: DashboardDegensRouteBoundary,
})
