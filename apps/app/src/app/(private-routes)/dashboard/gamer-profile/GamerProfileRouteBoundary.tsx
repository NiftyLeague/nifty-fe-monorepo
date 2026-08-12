'use client'

import dynamic from 'next/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

const GamerProfileClient = dynamic(() => import('./GamerProfileClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading gamer profile" />,
})

export default function GamerProfileRouteBoundary(): React.ReactNode {
  return <GamerProfileClient />
}
