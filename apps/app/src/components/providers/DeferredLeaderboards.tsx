'use client'

import { useEffect, useState } from 'react'

import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'

type LeaderBoardsComponent = typeof import('@/components/leaderboards').default

const loadLeaderBoards = () => import('@/components/leaderboards')

export function LeaderboardsLoading(): React.ReactNode {
  return (
    <div
      className="space-y-4"
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

function LeaderboardsLoadError({ onRetry }: { onRetry: () => void }): React.ReactNode {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2" role="alert">
      <span>Leaderboards could not be loaded.</span>
      <Button type="button" variant="link" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

export default function DeferredLeaderboards(): React.ReactNode {
  const [LeaderBoards, setLeaderBoards] = useState<LeaderBoardsComponent | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (LeaderBoards) return

    let active = true
    setLoadError(false)

    void loadLeaderBoards()
      .then(({ default: nextLeaderBoards }) => {
        if (active) setLeaderBoards(() => nextLeaderBoards)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [LeaderBoards, retryCount])

  if (LeaderBoards) return <LeaderBoards />
  if (loadError) {
    return <LeaderboardsLoadError onRetry={() => setRetryCount((count) => count + 1)} />
  }
  return <LeaderboardsLoading />
}
