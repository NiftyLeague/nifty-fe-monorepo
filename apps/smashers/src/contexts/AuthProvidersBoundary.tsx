'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'
import type { Session } from 'next-auth'

import { Skeleton } from '@nl/ui/base/skeleton'

type AuthProvidersProps = PropsWithChildren<{ session: Session | null }>

function AuthProvidersLoading(): React.ReactNode {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Skeleton aria-hidden="true" className="h-[28rem] w-full max-w-[800px] rounded-xl" />
      <span className="sr-only">Loading authentication</span>
    </div>
  )
}

const DeferredAuthProviders = dynamic(() => import('./AuthProviders'), {
  ssr: false,
  loading: AuthProvidersLoading,
})

export default function AuthProvidersBoundary({ children, session }: AuthProvidersProps) {
  return <DeferredAuthProviders session={session}>{children}</DeferredAuthProviders>
}
