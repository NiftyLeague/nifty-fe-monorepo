'use server'

import type { PropsWithChildren } from 'react'
import { headers } from 'next/headers'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext'
import { IMXProvider } from '@/contexts/IMXContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { NetworkProvider } from '@/contexts/NetworkContext'
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext'
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'
import ReduxProvider from '@/store/ReduxProvider'

interface WalletContextWrapperProps extends PropsWithChildren {
  includeCoreProviders?: boolean
}

export default async function WalletContextWrapper({
  children,
  includeCoreProviders = false,
}: WalletContextWrapperProps) {
  const cookies = (await headers()).get('cookie')
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'

  const walletContexts = auditFixtureEnabled ? (
    includeCoreProviders ? (
      <AuditFixtureContextWrapper>
        <ReduxProvider>
          <FeatureFlagProvider>{children}</FeatureFlagProvider>
        </ReduxProvider>
      </AuditFixtureContextWrapper>
    ) : (
      <AuditFixtureContextWrapper>{children}</AuditFixtureContextWrapper>
    )
  ) : (
    <NetworkProvider>
      <IMXProvider>
        {includeCoreProviders ? (
          <ReduxProvider>
            <AuthTokenProvider>
              <NFTsBalanceProvider>
                <TokensBalanceProvider>
                  <FeatureFlagProvider>{children}</FeatureFlagProvider>
                </TokensBalanceProvider>
              </NFTsBalanceProvider>
            </AuthTokenProvider>
          </ReduxProvider>
        ) : (
          <AuthTokenProvider>
            <NFTsBalanceProvider>
              <TokensBalanceProvider>{children}</TokensBalanceProvider>
            </NFTsBalanceProvider>
          </AuthTokenProvider>
        )}
      </IMXProvider>
    </NetworkProvider>
  )

  const web3Contexts = <Web3ModalProvider cookies={cookies}>{walletContexts}</Web3ModalProvider>

  return includeCoreProviders ? (
    <LocalStorageProvider>{web3Contexts}</LocalStorageProvider>
  ) : (
    web3Contexts
  )
}
