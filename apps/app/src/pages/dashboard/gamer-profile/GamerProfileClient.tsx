import dynamic from '@/runtime/dynamic'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'
import type { JSX } from 'solid-js'

const GamerProfilePageContent = dynamic(() => import('./GamerProfileContent'), {
  ssr: false,
  loading: () => (
    <div
      class="flex min-h-144 flex-col gap-6 rounded-md border border-border bg-muted p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading gamer profile"
    >
      <div class="flex flex-col gap-4 lg:flex-row">
        <DeferredSkeleton class="h-56 w-full rounded lg:w-1/3" />
        <DeferredSkeleton class="h-56 w-full rounded lg:flex-1" />
      </div>
      <DeferredSkeleton class="h-48 w-full rounded" />
      <span class="sr-only">Loading gamer profile</span>
    </div>
  ),
})

export default function GamerProfileClient(): JSX.Element {
  return (
    <DashboardDataBoundary includeTokens={false}>
      <GamerProfilePageContent />
    </DashboardDataBoundary>
  )
}
