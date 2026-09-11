'use client'

import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

const DashboardOverviewClient = dynamic(() => import('./DashboardOverviewClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading dashboard overview" />,
})

export default function DashboardOverviewRouteBoundary(): React.ReactNode {
  return <DashboardOverviewClient />
}
