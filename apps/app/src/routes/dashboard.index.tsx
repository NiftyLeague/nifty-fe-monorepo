import { createFileRoute } from '@tanstack/solid-router'

import DashboardOverviewRouteBoundary from '@/pages/dashboard/overview/DashboardOverviewRouteBoundary'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverviewRouteBoundary,
})
