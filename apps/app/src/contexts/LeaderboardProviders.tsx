'use client'

import type { PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'

import WalletAuthProviders from '@/contexts/WalletAuthProviders'
import WalletStorageProviders from '@/contexts/WalletStorageProviders'

const DeferredAuditFixtureContextWrapper = dynamic(
  () => import('@/contexts/AuditFixtureContextWrapper'),
  { ssr: false, loading: () => null }
)

/**
 * The archived leaderboard only needs wallet authentication. Keep dashboard
 * network, Immutable, NFT, and token-balance clients out of this public route.
 */
export default function LeaderboardProviders({ children }: PropsWithChildren) {
  const auditFixtureEnabled = process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true'
  const cookies = typeof document === 'undefined' ? null : document.cookie

  if (!auditFixtureEnabled) {
    return <WalletAuthProviders cookies={cookies}>{children}</WalletAuthProviders>
  }

  return (
    <WalletStorageProviders cookies={cookies}>
      <DeferredAuditFixtureContextWrapper>{children}</DeferredAuditFixtureContextWrapper>
    </WalletStorageProviders>
  )
}
