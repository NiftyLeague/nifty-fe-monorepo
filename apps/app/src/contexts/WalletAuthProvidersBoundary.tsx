'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

import RouteLoading from '@nl/ui/custom/route-loading'

type WalletAuthProvidersProps = PropsWithChildren<{ cookies?: string | null }>

const DeferredWalletAuthProviders = dynamic(() => import('./WalletAuthProviders'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading wallet verification" />,
})

export default function WalletAuthProvidersBoundary({
  children,
  cookies,
}: WalletAuthProvidersProps) {
  return <DeferredWalletAuthProviders cookies={cookies}>{children}</DeferredWalletAuthProviders>
}
