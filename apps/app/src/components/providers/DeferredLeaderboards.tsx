'use client'

import DeferredComponent from '@nl/ui/custom/deferred-component'
import RouteLoading from '@nl/ui/custom/route-loading'

const loadLeaderBoards = () => import('@/components/leaderboards')

export default function DeferredLeaderboards(): React.ReactNode {
  return (
    <DeferredComponent
      label="Leaderboards"
      load={loadLeaderBoards}
      loadingFallback={<RouteLoading label="Loading leaderboards" />}
      props={{}}
    />
  )
}
