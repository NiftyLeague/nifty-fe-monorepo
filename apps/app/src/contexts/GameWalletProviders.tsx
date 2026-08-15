'use client'

import dynamic from 'next/dynamic'
import type { PropsWithChildren } from 'react'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import WalletAuthProviders from '@/contexts/WalletAuthProviders'

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

  return <WalletAuthProviders cookies={cookies}>{walletFeatures}</WalletAuthProviders>
}
