'use client'

import type { PropsWithChildren } from 'react'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { IMXProvider } from '@/contexts/IMXContext'
import { NetworkProvider } from '@/contexts/NetworkContext'
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext'
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

export default function WalletFeatureProviders({ children }: PropsWithChildren) {
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'

  const walletContexts = auditFixtureEnabled ? (
    <AuditFixtureContextWrapper>{children}</AuditFixtureContextWrapper>
  ) : (
    <NetworkProvider>
      <IMXProvider>
        <AuthTokenProvider>
          <NFTsBalanceProvider>
            <TokensBalanceProvider>{children}</TokensBalanceProvider>
          </NFTsBalanceProvider>
        </AuthTokenProvider>
      </IMXProvider>
    </NetworkProvider>
  )

  return <Web3ModalProvider>{walletContexts}</Web3ModalProvider>
}
