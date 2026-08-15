'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

const WalletFeatureProviders = dynamic(() => import('@/contexts/WalletFeatureProviders'), {
  ssr: false,
  loading: () => (
    <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
      Loading wallet balances
    </div>
  ),
})

interface GameWalletProvidersProps extends PropsWithChildren {
  loadWalletFeatures?: boolean
}

export default function GameWalletProviders({
  loadWalletFeatures = true,
  children,
}: GameWalletProvidersProps) {
  const cookies = typeof document === 'undefined' ? null : document.cookie
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'

  const walletFeatures = auditFixtureEnabled ? (
    <AuditFixtureContextWrapper>{children}</AuditFixtureContextWrapper>
  ) : loadWalletFeatures ? (
    <WalletFeatureProviders>{children}</WalletFeatureProviders>
  ) : (
    children
  )

  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>
        <AuthStatusProvider>
          <AuthTokenProvider>{walletFeatures}</AuthTokenProvider>
        </AuthStatusProvider>
      </Web3ModalProvider>
    </LocalStorageProvider>
  )
}
