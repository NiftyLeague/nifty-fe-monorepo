import { createFileRoute } from '@tanstack/react-router'

import DashboardOverviewRouteBoundary from '@/pages/dashboard/overview/DashboardOverviewRouteBoundary'
import { buildHead } from '@/runtime/metadata'

export const Route = createFileRoute('/dashboard/overview')({
  head: () => buildHead({ path: '/dashboard/overview', title: 'Dashboard Overview' }),
  component: DashboardOverviewRouteBoundary,
})
