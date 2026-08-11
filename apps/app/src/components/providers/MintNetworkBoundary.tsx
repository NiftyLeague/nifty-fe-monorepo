'use client'

import { useEffect, useState, type ComponentType, type PropsWithChildren } from 'react'

import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'

type MintNetworkProvider = ComponentType<PropsWithChildren>

const loadMintNetworkProvider = () =>
  import('@/contexts/NetworkProvider').then(({ NetworkProvider }) => NetworkProvider)

export default function MintNetworkBoundary({ children }: PropsWithChildren) {
  const [Provider, setProvider] = useState<MintNetworkProvider | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const shouldLoadProvider = process.env.NEXT_PUBLIC_AUDIT_FIXTURE !== 'true'

  useEffect(() => {
    if (!shouldLoadProvider) return

    let active = true
    setProvider(null)
    setLoadError(false)

    loadMintNetworkProvider()
      .then((nextProvider) => {
        if (active) setProvider(() => nextProvider)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [retryCount, shouldLoadProvider])

  if (!shouldLoadProvider) return children

  if (loadError) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
        <p>Wallet network could not be loaded.</p>
        <Button
          type="button"
          variant="link"
          className="text-primary underline underline-offset-4"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Retry
        </Button>
      </div>
    )
  }

  if (!Provider) {
    return (
      <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
        <Skeleton className="h-8 w-32" />
        <span className="sr-only">Loading wallet network</span>
      </div>
    )
  }

  return <Provider>{children}</Provider>
}
