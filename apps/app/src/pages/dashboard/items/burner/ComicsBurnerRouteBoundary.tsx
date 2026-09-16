import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'
import type { JSX } from 'solid-js'

const ComicsBurnerClient = dynamic(() => import('./ComicsBurnerClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading comics burner" />,
})

export default function ComicsBurnerRouteBoundary(): JSX.Element {
  return <ComicsBurnerClient />
}
