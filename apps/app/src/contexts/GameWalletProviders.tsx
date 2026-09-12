'use client'

import dynamic from '@/runtime/dynamic'
import type { PropsWithChildren } from 'react'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import WalletAuthProviders from '@/contexts/WalletAuthProviders'
import { AUDIT_FIXTURE } from '@/runtime/env'
import { getRequestCookieHeader } from '@/runtime/request-cookies'

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
  const cookies = getRequestCookieHeader()
  const auditFixtureEnabled = AUDIT_FIXTURE

  const walletFeatures = auditFixtureEnabled ? (
    <AuditFixtureContextWrapper>{children}</AuditFixtureContextWrapper>
  ) : loadWalletFeatures ? (
    <WalletFeatureProviders>{children}</WalletFeatureProviders>
  ) : (
    children
  )

  return <WalletAuthProviders cookies={cookies}>{walletFeatures}</WalletAuthProviders>
}
