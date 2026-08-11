'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

import { Skeleton } from '@nl/ui/base/skeleton'

const MintNetworkProvider = dynamic(
  () => import('@/contexts/NetworkProvider').then(({ NetworkProvider }) => NetworkProvider),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
        <Skeleton className="h-8 w-32" />
        <span className="sr-only">Loading wallet network</span>
      </div>
    ),
  }
)

export default function MintNetworkBoundary({ children }: PropsWithChildren) {
  if (process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true') return children

  return <MintNetworkProvider>{children}</MintNetworkProvider>
}
