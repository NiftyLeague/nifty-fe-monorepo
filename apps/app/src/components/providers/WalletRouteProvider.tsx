'use client'

import type { PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'

const WalletFeatureLoading = () => (
  <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
    Loading wallet features
  </div>
)

const WalletFeatureProviders = dynamic(() => import('@/contexts/WalletFeatureProviders'), {
  ssr: false,
  loading: WalletFeatureLoading,
})

export default function WalletRouteProvider({ children }: PropsWithChildren) {
  return <WalletFeatureProviders>{children}</WalletFeatureProviders>
}
