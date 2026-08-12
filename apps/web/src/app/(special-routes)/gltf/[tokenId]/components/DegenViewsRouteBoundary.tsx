'use client'

import dynamic from 'next/dynamic'

import RouteLoading from '@nl/ui/custom/route-loading'

import type { DegenViewsProps } from './DegenViews'

const DegenViewsClient = dynamic(() => import('./DegenViews'), {
  loading: () => <RouteLoading label="Loading DEGEN viewer" />,
})

export default function DegenViewsRouteBoundary(props: DegenViewsProps): React.ReactNode {
  return <DegenViewsClient {...props} />
}
