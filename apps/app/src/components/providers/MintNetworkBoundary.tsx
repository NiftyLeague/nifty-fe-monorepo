'use client'

import type { PropsWithChildren } from 'react'

import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import DeferredComponent from '@nl/ui/custom/deferred-component'

const loadMintNetworkProvider = () =>
  import('@/contexts/NetworkProvider').then(({ NetworkProvider }) => ({ default: NetworkProvider }))

export default function MintNetworkBoundary({ children }: PropsWithChildren) {
  const shouldLoadProvider = process.env.NEXT_PUBLIC_AUDIT_FIXTURE !== 'true'

  return (
    <DeferredComponent
      disabledFallback={children}
      enabled={shouldLoadProvider}
      label="wallet network"
      load={loadMintNetworkProvider}
      loadingFallback={
        <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
          <DeferredSkeleton className="h-8 w-32" />
          <span className="sr-only">Loading wallet network</span>
        </div>
      }
      errorFallback={(onRetry) => (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
          <p>Wallet network could not be loaded.</p>
          <Button
            type="button"
            variant="link"
            className="text-primary underline underline-offset-4"
            onClick={onRetry}
          >
            Retry
          </Button>
        </div>
      )}
      props={{ children }}
    />
  )
}
