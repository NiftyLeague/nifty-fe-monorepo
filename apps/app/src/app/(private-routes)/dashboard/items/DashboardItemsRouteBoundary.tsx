'use client'

import dynamic from 'next/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

const DashboardItemsClient = dynamic(() => import('./DashboardItemsClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading dashboard comics and items" />,
})

export default function DashboardItemsRouteBoundary(): React.ReactNode {
  return <DashboardItemsClient />
}
