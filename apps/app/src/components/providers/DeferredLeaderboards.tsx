'use client'

import DeferredComponent from '@nl/ui/custom/deferred-component'
import { Skeleton } from '@nl/ui/base/skeleton'

function LeaderboardsLoading(): React.ReactNode {
  return (
    <div
      className="flex flex-col gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading leaderboards"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-32" />
        <Skeleton className="h-10 w-full sm:w-24" />
      </div>
      <Skeleton className="h-96 w-full" />
      <span className="sr-only">Loading leaderboards</span>
    </div>
  )
}

const loadLeaderBoards = () => import('@/components/leaderboards')

export default function DeferredLeaderboards(): React.ReactNode {
  return (
    <DeferredComponent
      label="Leaderboards"
      load={loadLeaderBoards}
      loadingFallback={<LeaderboardsLoading />}
      props={{}}
    />
  )
}
