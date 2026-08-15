'use client'

import type { PropsWithChildren } from 'react'

import { IMXProvider } from '@/contexts/IMXContext'
import { NetworkProvider } from '@/contexts/NetworkProvider'
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext'
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext'

export default function WalletFeatureProviders({ children }: PropsWithChildren) {
  return (
    <NetworkProvider>
      <IMXProvider>
        <NFTsBalanceProvider>
          <TokensBalanceProvider>{children}</TokensBalanceProvider>
        </NFTsBalanceProvider>
      </IMXProvider>
    </NetworkProvider>
  )
}
