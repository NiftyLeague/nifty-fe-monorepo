import { For } from 'solid-js'
import dynamic from '@/runtime/dynamic'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'
import type { JSX } from 'solid-js'

const DashboardItemsPageContent = dynamic(() => import('./DashboardItemsContent'), {
  ssr: false,
  loading: () => (
    <div
      class="flex min-h-128 flex-col gap-4 rounded-md border border-border bg-muted p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading dashboard comics and items"
    >
      <DeferredSkeleton class="h-10 w-full rounded" />
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <For each={Array.from({ length: 8 })}>
          {() => <DeferredSkeleton class="h-48 w-full rounded" />}
        </For>
      </div>
      <span class="sr-only">Loading dashboard comics and items</span>
    </div>
  ),
})

export default function DashboardItemsClient(): JSX.Element {
  return (
    <DashboardDataBoundary includeTokens={false}>
      <DashboardItemsPageContent />
    </DashboardDataBoundary>
  )
}
