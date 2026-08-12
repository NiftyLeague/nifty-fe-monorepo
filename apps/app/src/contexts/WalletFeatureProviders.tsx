'use client'

import type { PropsWithChildren } from 'react'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { IMXProvider } from '@/contexts/IMXContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { NetworkProvider } from '@/contexts/NetworkProvider'
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext'
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

export default function WalletFeatureProviders({ children }: PropsWithChildren) {
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'
  const cookies = typeof document === 'undefined' ? null : document.cookie

  const walletContexts = auditFixtureEnabled ? (
    <AuditFixtureContextWrapper>{children}</AuditFixtureContextWrapper>
  ) : (
    <NetworkProvider>
      <IMXProvider>
        <AuthStatusProvider>
          <AuthTokenProvider>
            <NFTsBalanceProvider>
              <TokensBalanceProvider>{children}</TokensBalanceProvider>
            </NFTsBalanceProvider>
          </AuthTokenProvider>
        </AuthStatusProvider>
      </IMXProvider>
    </NetworkProvider>
  )

  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>{walletContexts}</Web3ModalProvider>
    </LocalStorageProvider>
  )
}
