'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@nl/ui/base/skeleton'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'

const ComicsBurnerContent = dynamic(() => import('./ComicsBurnerContent'), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[40rem] flex-col gap-4 rounded-md border border-border bg-muted p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading comics burner"
    >
      <Skeleton className="h-8 w-48 rounded" />
      <Skeleton className="h-96 w-full rounded" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded" />
        ))}
      </div>
      <span className="sr-only">Loading comics burner</span>
    </div>
  ),
})

export default function ComicsBurnerClient(): React.ReactNode {
  return (
    <DashboardDataBoundary includeTokens={false}>
      <ComicsBurnerContent />
    </DashboardDataBoundary>
  )
}
