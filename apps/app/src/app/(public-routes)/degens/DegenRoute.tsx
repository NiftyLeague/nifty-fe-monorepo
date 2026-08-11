'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@nl/ui/base/skeleton'

const AllDegensPage = dynamic(() => import('./AllDegensPage'), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[40vh] items-center justify-center p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading degens</span>
      <Skeleton aria-hidden="true" className="h-8 w-8 rounded-full" />
    </div>
  ),
})

export default function DegenRoute() {
  return <AllDegensPage />
}
