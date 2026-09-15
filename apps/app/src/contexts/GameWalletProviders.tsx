'use client'

import dynamic from '@/runtime/dynamic'
import type { ParentProps } from 'solid-js'

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

export default function GameWalletProviders(props: ParentProps) {
  const auditFixtureEnabled = AUDIT_FIXTURE

  if (auditFixtureEnabled)
    return <AuditFixtureContextWrapper>{props.children}</AuditFixtureContextWrapper>

  const cookies = getRequestCookieHeader()

  return (
    <WalletAuthProviders cookies={cookies}>
      <WalletFeatureProviders>{props.children}</WalletFeatureProviders>
    </WalletAuthProviders>
  )
}
