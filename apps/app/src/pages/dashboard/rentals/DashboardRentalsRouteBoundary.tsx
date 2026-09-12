'use client'

import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

const DashboardRentalsClient = dynamic(() => import('./DashboardRentalsClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading rentals" />,
})

export default function DashboardRentalsRouteBoundary(): React.ReactNode {
  return <DashboardRentalsClient />
}
