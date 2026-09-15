'use client'

import dynamic from '@/runtime/dynamic'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import type { JSX } from 'solid-js'

const DashboardRentalsPageContent = dynamic(() => import('./DashboardRentalsContent'), {
  ssr: false,
  loading: () => (
    <div
      class="flex min-h-[36rem] flex-col gap-6 rounded-md border border-border bg-muted p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading rentals"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <DeferredSkeleton class="h-8 w-40 rounded" />
        <DeferredSkeleton class="h-10 w-64 rounded" />
      </div>
      <DeferredSkeleton class="h-[calc(100vh-320px)] w-full rounded" />
      <span class="sr-only">Loading rentals</span>
    </div>
  ),
})

export default function DashboardRentalsClient(): JSX.Element {
  return <DashboardRentalsPageContent />
}
