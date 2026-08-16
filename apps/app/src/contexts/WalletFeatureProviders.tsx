'use client'

import type { PropsWithChildren } from 'react'

import NFTDataProviders from '@/contexts/NFTDataProviders'
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext'

export default function WalletFeatureProviders({ children }: PropsWithChildren) {
  return (
    <NFTDataProviders>
      <TokensBalanceProvider>{children}</TokensBalanceProvider>
    </NFTDataProviders>
  )
}
