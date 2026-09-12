'use client'

import type { PropsWithChildren } from 'react'
import dynamic from '@/runtime/dynamic'

import WalletAuthProviders from '@/contexts/WalletAuthProviders'
import WalletStorageProviders from '@/contexts/WalletStorageProviders'
import { AUDIT_FIXTURE } from '@/runtime/env'
import { getRequestCookieHeader } from '@/runtime/request-cookies'

const DeferredAuditFixtureContextWrapper = dynamic(
  () => import('@/contexts/AuditFixtureContextWrapper'),
  { ssr: false, loading: () => null }
)

/**
 * The archived leaderboard only needs wallet authentication. Keep dashboard
 * network, Immutable, NFT, and token-balance clients out of this public route.
 */
export default function LeaderboardProviders({ children }: PropsWithChildren) {
  const auditFixtureEnabled = AUDIT_FIXTURE
  const cookies = getRequestCookieHeader()

  if (!auditFixtureEnabled) {
    return <WalletAuthProviders cookies={cookies}>{children}</WalletAuthProviders>
  }

  return (
    <WalletStorageProviders cookies={cookies}>
      <DeferredAuditFixtureContextWrapper>{children}</DeferredAuditFixtureContextWrapper>
    </WalletStorageProviders>
  )
}
