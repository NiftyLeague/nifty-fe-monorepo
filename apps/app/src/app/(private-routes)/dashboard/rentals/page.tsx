'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@nl/ui/base/skeleton'

import DashboardDataBoundary from '@/components/providers/DashboardDataBoundary'

const DashboardRentalsPageContent = dynamic(() => import('./DashboardRentalsContent'), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[36rem] flex-col gap-6 rounded-md border border-border bg-muted p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading rentals"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-8 w-40 rounded" />
        <Skeleton className="h-10 w-64 rounded" />
      </div>
      <Skeleton className="h-[calc(100vh-320px)] w-full rounded" />
      <span className="sr-only">Loading rentals</span>
    </div>
  ),
})

export default function DashboardRentalsPage() {
  return (
    <DashboardDataBoundary>
      <DashboardRentalsPageContent />
    </DashboardDataBoundary>
  )
}
