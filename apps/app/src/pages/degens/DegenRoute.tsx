import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

export function DegenRouteLoading() {
  return <RouteLoading label="Loading degens" />
}

/**
 * Server-rendered on purpose: the route loader prefetches the first DEGEN
 * page into the query cache, so SSR streams the real grid instead of a
 * spinner, and the dehydrated payload hydrates without a client refetch.
 */
const AllDegensPage = dynamic(() => import('./AllDegensPage'), {
  loading: () => <DegenRouteLoading />,
})

export default function DegenRoute() {
  return <AllDegensPage />
}
