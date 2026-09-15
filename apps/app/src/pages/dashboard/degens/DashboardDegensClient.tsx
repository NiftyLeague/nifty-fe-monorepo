'use client'

import { For } from 'solid-js'
import dynamic from '@/runtime/dynamic'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'
import type { JSX } from 'solid-js'

const DashboardDegensPageContent = dynamic(() => import('./DashboardDegensContent'), {
  ssr: false,
  loading: () => (
    <div
      class="flex min-h-[32rem] flex-col gap-4 rounded-md border border-border bg-muted p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading dashboard DEGENs"
    >
      <DeferredSkeleton class="h-10 w-full rounded" />
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <For each={Array.from({ length: 8 })}>
          {() => <DeferredSkeleton class="h-48 w-full rounded" />}
        </For>
      </div>
      <span class="sr-only">Loading dashboard DEGENs</span>
    </div>
  ),
})

export default function DashboardDegensClient(): JSX.Element {
  return (
    <DashboardDataBoundary includeTokens={false}>
      <DashboardDegensPageContent />
    </DashboardDataBoundary>
  )
}
