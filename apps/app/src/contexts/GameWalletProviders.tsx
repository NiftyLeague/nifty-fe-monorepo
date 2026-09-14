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
  const auditFixtureEnabled = AUDIT_FIXTURE

  if (auditFixtureEnabled)
    return <AuditFixtureContextWrapper>{children}</AuditFixtureContextWrapper>

  const cookies = getRequestCookieHeader()
  const walletFeatures = loadWalletFeatures ? (
    <WalletFeatureProviders>{children}</WalletFeatureProviders>
  ) : (
    children
  )

  return <WalletAuthProviders cookies={cookies}>{walletFeatures}</WalletAuthProviders>
}
