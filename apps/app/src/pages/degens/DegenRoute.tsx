import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

export function DegenRouteLoading() {
  return <RouteLoading label="Loading degens" />
}

/**
 * Client-only on purpose, for now: the lazy page chunk does not resolve
 * inside the nitro SSR stream (the outlet renders blank instead of the
 * Suspense fallback), while the client paints instantly from the loader's
 * dehydrated query cache. Revisit once the server chunk resolution is
 * understood — the win would be the grid in the streamed HTML.
 */
const AllDegensPage = dynamic(() => import('./AllDegensPage'), {
  loading: () => <DegenRouteLoading />,
  ssr: false,
})

export default function DegenRoute() {
  return <AllDegensPage />
}
