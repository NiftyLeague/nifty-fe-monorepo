import dynamic from 'next/dynamic'

import { Skeleton } from '@nl/ui/base/skeleton'

const loadingCards = Array.from({ length: 12 }, (_, index) => index)

function DegenRouteLoading() {
  return (
    <div
      className="flex min-h-[40vh] flex-col gap-4 p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading degens</span>
      <div aria-hidden="true" className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-8 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      <div aria-hidden="true" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loadingCards.map((index) => (
          <Skeleton key={index} className="aspect-square w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}

const AllDegensPage = dynamic(() => import('./AllDegensPage'), {
  loading: () => <DegenRouteLoading />,
})

export default function DegenRoute() {
  return <AllDegensPage />
}
