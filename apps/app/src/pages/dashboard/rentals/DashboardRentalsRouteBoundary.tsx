import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'
import type { JSX } from 'solid-js'

const DashboardRentalsClient = dynamic(() => import('./DashboardRentalsClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading rentals" />,
})

export default function DashboardRentalsRouteBoundary(): JSX.Element {
  return <DashboardRentalsClient />
}
