'use server'

// third party
import type { PropsWithChildren } from 'react'
import { headers } from 'next/headers'

// app context
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext'
import { IMXProvider } from '@/contexts/IMXContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { NetworkProvider } from '@/contexts/NetworkContext'
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext'
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'
import ReduxProvider from '@/store/ReduxProvider'

const AppContextWrapper = async ({ children }: PropsWithChildren) => {
  const headersList = await headers()
  const cookies = headersList.get('cookie')
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'

  const appContexts = auditFixtureEnabled ? (
    <AuditFixtureContextWrapper>
      <ReduxProvider>
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      </ReduxProvider>
    </AuditFixtureContextWrapper>
  ) : (
    <NetworkProvider>
      <IMXProvider>
        <ReduxProvider>
          <AuthTokenProvider>
            <NFTsBalanceProvider>
              <TokensBalanceProvider>
                <FeatureFlagProvider>{children}</FeatureFlagProvider>
              </TokensBalanceProvider>
            </NFTsBalanceProvider>
          </AuthTokenProvider>
        </ReduxProvider>
      </IMXProvider>
    </NetworkProvider>
  )

  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>{appContexts}</Web3ModalProvider>
    </LocalStorageProvider>
  )
}

export default AppContextWrapper
