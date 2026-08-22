import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

interface PrivateRoutesBoundaryProps extends PropsWithChildren {
  cookies?: string | null
}

export function PrivateRoutesLoading(): React.ReactNode {
  return (
    <div
      className="flex min-h-screen flex-col gap-6 bg-background p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <DeferredSkeleton className="h-14 w-full rounded-lg" />
      <div className="flex min-h-0 flex-1 gap-6">
        <DeferredSkeleton className="hidden w-64 rounded-lg lg:block" />
        <DeferredSkeleton className="min-h-[24rem] flex-1 rounded-lg" />
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
