import dynamic from '@/runtime/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'
import type { JSX } from 'solid-js'

const GamerProfileClient = dynamic(() => import('./GamerProfileClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading gamer profile" />,
})

export default function GamerProfileRouteBoundary(): JSX.Element {
  return <GamerProfileClient />
}
