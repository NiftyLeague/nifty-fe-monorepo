'use client'

import dynamic from 'next/dynamic'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'

const GamerProfilePageContent = dynamic(() => import('./GamerProfileContent'), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[36rem] flex-col gap-6 rounded-md border border-border bg-muted p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading gamer profile"
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <DeferredSkeleton className="h-56 w-full rounded lg:w-1/3" />
        <DeferredSkeleton className="h-56 w-full rounded lg:flex-1" />
      </div>
      <DeferredSkeleton className="h-48 w-full rounded" />
      <span className="sr-only">Loading gamer profile</span>
    </div>
  ),
})

export default function GamerProfileClient(): React.ReactNode {
  return (
    <DashboardDataBoundary includeTokens={false}>
      <GamerProfilePageContent />
    </DashboardDataBoundary>
  )
}
