'use client'

import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

export function WalletProviderLoading() {
  return (
    <div
      class="flex min-h-screen flex-col gap-6 bg-background p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <DeferredSkeleton class="h-14 w-full rounded-lg" />
      <div class="flex min-h-0 flex-1 gap-6">
        <DeferredSkeleton class="hidden w-64 rounded-lg lg:block" />
        <DeferredSkeleton class="min-h-[24rem] flex-1 rounded-lg" />
      </div>
      <span class="sr-only">Loading wallet provider</span>
    </div>
  )
}

export function WalletProviderError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      class="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-6 text-center"
      role="alert"
    >
      <p>Wallet provider could not be loaded.</p>
      <Button type="button" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}
