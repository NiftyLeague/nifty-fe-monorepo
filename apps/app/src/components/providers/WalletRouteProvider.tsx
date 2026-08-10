'use client'

import type { PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'

const WalletFeatureProviders = dynamic(() => import('@/contexts/WalletFeatureProviders'), {
  ssr: false,
  loading: () => null,
})

export default function WalletRouteProvider({ children }: PropsWithChildren) {
  return <WalletFeatureProviders>{children}</WalletFeatureProviders>
}
