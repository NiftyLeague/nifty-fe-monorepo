'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

import { Skeleton } from '@nl/ui/base/skeleton'

interface PrivateRoutesBoundaryProps extends PropsWithChildren {
  cookies?: string | null
}

function PrivateRoutesLoading(): React.ReactNode {
  return (
    <div
      className="flex min-h-screen flex-col gap-6 bg-background p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Skeleton className="h-14 w-full rounded-lg" />
      <div className="flex min-h-0 flex-1 gap-6">
        <Skeleton className="hidden w-64 rounded-lg lg:block" />
        <Skeleton className="min-h-[24rem] flex-1 rounded-lg" />
      </div>
      <span className="sr-only">Loading private app</span>
    </div>
  )
}

const PrivateRoutesShell = dynamic(() => import('./PrivateRoutesShell'), {
  loading: PrivateRoutesLoading,
})

export default function PrivateRoutesBoundary({ children, cookies }: PrivateRoutesBoundaryProps) {
  return <PrivateRoutesShell cookies={cookies}>{children}</PrivateRoutesShell>
}
