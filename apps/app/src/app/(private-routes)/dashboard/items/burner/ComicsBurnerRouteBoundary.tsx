'use client'

import dynamic from 'next/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

const ComicsBurnerClient = dynamic(() => import('./ComicsBurnerClient'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading comics burner" />,
})

export default function ComicsBurnerRouteBoundary(): React.ReactNode {
  return <ComicsBurnerClient />
}
