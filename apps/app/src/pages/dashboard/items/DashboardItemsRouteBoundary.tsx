'use client'

import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'
import type { JSX } from 'solid-js'

const DashboardItemsClient = dynamic(() => import('./DashboardItemsClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading dashboard comics and items" />,
})

export default function DashboardItemsRouteBoundary(): JSX.Element {
  return <DashboardItemsClient />
}
