'use client'

import type { PropsWithChildren } from 'react'
import dynamic from '@/runtime/dynamic'

const WalletFeatureLoading = () => (
  <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
    Loading wallet features
  </div>
)

const GameWalletProviders = dynamic(() => import('@/contexts/GameWalletProviders'), {
  ssr: false,
  loading: WalletFeatureLoading,
})

export default function WalletRouteProvider({ children }: PropsWithChildren) {
  return <GameWalletProviders>{children}</GameWalletProviders>
}
