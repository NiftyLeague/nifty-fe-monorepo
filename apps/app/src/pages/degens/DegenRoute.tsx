'use client'

import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

export function DegenRouteLoading() {
  return <RouteLoading label="Loading degens" />
}

const AllDegensPage = dynamic(() => import('./AllDegensPage'), {
  loading: () => <DegenRouteLoading />,
  ssr: false,
})

export default function DegenRoute() {
  return <AllDegensPage />
}
