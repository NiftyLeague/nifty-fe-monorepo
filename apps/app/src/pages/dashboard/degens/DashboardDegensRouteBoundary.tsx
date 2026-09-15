'use client'

import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'
import type { JSX } from 'solid-js'

const DashboardDegensClient = dynamic(() => import('./DashboardDegensClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading dashboard DEGENs" />,
})

export default function DashboardDegensRouteBoundary(): JSX.Element {
  return <DashboardDegensClient />
}
