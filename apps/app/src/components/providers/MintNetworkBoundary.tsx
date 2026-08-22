'use client'

import type { PropsWithChildren } from 'react'

import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

const loadMintNetworkProvider = () =>
  import('@/contexts/NetworkProvider').then(({ NetworkProvider }) => ({ default: NetworkProvider }))

export default function MintNetworkBoundary({ children }: PropsWithChildren) {
  const shouldLoadProvider = process.env.NEXT_PUBLIC_AUDIT_FIXTURE !== 'true'
  const {
    Component: Provider,
    hasError: loadError,
    retry,
  } = useDeferredComponent<PropsWithChildren>(loadMintNetworkProvider, shouldLoadProvider)

  if (!shouldLoadProvider) return children

  if (loadError) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
        <p>Wallet network could not be loaded.</p>
        <Button
          type="button"
          variant="link"
          className="text-primary underline underline-offset-4"
          onClick={retry}
        >
          Retry
        </Button>
      </div>
    )
  }

  if (!Provider) {
    return (
      <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
        <DeferredSkeleton className="h-8 w-32" />
        <span className="sr-only">Loading wallet network</span>
      </div>
    )
  }

  return <Provider>{children}</Provider>
}
