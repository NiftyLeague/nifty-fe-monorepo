'use client'

import dynamic from '@/runtime/dynamic'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'

const ComicsBurnerContent = dynamic(() => import('./ComicsBurnerContent'), {
  ssr: false,
  loading: () => (
    <div
      class="flex min-h-[40rem] flex-col gap-4 rounded-md border border-border bg-muted p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading comics burner"
    >
      <DeferredSkeleton class="h-8 w-48 rounded" />
      <DeferredSkeleton class="h-96 w-full rounded" />
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <DeferredSkeleton key={index} class="h-24 w-full rounded" />
        ))}
      </div>
      <span class="sr-only">Loading comics burner</span>
    </div>
  ),
})

export default function ComicsBurnerClient(): JSX.Element {
  return (
    <DashboardDataBoundary includeTokens={false}>
      <ComicsBurnerContent />
    </DashboardDataBoundary>
  )
}
