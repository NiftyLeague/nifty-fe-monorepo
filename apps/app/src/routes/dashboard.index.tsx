import { createFileRoute } from '@tanstack/react-router'

import DashboardOverviewRouteBoundary from '@/pages/dashboard/overview/DashboardOverviewRouteBoundary'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverviewRouteBoundary,
})
