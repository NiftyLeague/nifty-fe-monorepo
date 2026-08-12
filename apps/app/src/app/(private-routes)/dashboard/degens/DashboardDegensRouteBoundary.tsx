'use client'

import dynamic from 'next/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

const DashboardDegensClient = dynamic(() => import('./DashboardDegensClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading dashboard DEGENs" />,
})

export default function DashboardDegensRouteBoundary(): React.ReactNode {
  return <DashboardDegensClient />
}
