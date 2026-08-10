'use client'

import WalletFeatureProviders from '@/contexts/WalletFeatureProviders'
import Web3GameList from './index'

export default function DeferredWeb3GameList() {
  return (
    <WalletFeatureProviders>
      <Web3GameList />
    </WalletFeatureProviders>
  )
}
