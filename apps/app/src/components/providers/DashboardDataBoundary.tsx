'use client'

import { useEffect, useState, type ComponentType, type PropsWithChildren } from 'react'

import { Button } from '@nl/ui/base/button'

type DashboardDataProvider = ComponentType<PropsWithChildren>

const loadDashboardDataProviders = () => import('@/contexts/DashboardDataProviders')

export default function DashboardDataBoundary({ children }: PropsWithChildren) {
  const [Provider, setProvider] = useState<DashboardDataProvider | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    setLoadError(false)

    loadDashboardDataProviders()
      .then(({ default: nextProvider }) => {
        if (active) setProvider(() => nextProvider)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [retryCount])

  if (loadError) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
        <p>Dashboard data could not be loaded.</p>
        <Button variant="outline" onClick={() => setRetryCount((count) => count + 1)}>
          Retry
        </Button>
      </div>
    )
  }

  if (!Provider) {
    return (
      <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
        <span className="sr-only">Loading dashboard data</span>
        <span className="h-6 w-6 animate-pulse rounded-full bg-muted-foreground/20" />
      </div>
    )
  }

  return <Provider>{children}</Provider>
}
