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
    <div class="sr-only" role="status" aria-live="polite" aria-busy="true">
      Loading wallet balances
    </div>
  ),
})

export default function GameWalletProviders({ children }: PropsWithChildren) {
  const auditFixtureEnabled = AUDIT_FIXTURE

  if (auditFixtureEnabled)
    return <AuditFixtureContextWrapper>{children}</AuditFixtureContextWrapper>

  const cookies = getRequestCookieHeader()

  return (
    <WalletAuthProviders cookies={cookies}>
      <WalletFeatureProviders>{children}</WalletFeatureProviders>
    </WalletAuthProviders>
  )
}
