'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@nl/ui/base/skeleton'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'

const DashboardDegensPageContent = dynamic(() => import('./DashboardDegensContent'), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[32rem] flex-col gap-4 rounded-md border border-border bg-muted p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading dashboard DEGENs"
    >
      <Skeleton className="h-10 w-full rounded" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded" />
        ))}
      </div>
      <span className="sr-only">Loading dashboard DEGENs</span>
    </div>
  ),
})

export default function DashboardDegensClient(): React.ReactNode {
  return (
    <DashboardDataBoundary includeTokens={false}>
      <DashboardDegensPageContent />
    </DashboardDataBoundary>
  )
}
