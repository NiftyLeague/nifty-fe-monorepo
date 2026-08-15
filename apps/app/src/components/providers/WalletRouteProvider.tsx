'use client'

import type { PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'

const WalletFeatureLoading = () => (
  <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
    Loading wallet features
  </div>
)

const GameWalletProviders = dynamic(() => import('@/contexts/GameWalletProviders'), {
  ssr: false,
  loading: WalletFeatureLoading,
})

interface WalletRouteProviderProps extends PropsWithChildren {
  loadWalletFeatures?: boolean
}

export default function WalletRouteProvider({
  loadWalletFeatures,
  children,
}: WalletRouteProviderProps) {
  return (
    <GameWalletProviders loadWalletFeatures={loadWalletFeatures}>{children}</GameWalletProviders>
  )
}
