'use client'

import type { PropsWithChildren } from 'react'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import { IMXProvider } from '@/contexts/IMXContext'
import { NetworkProvider } from '@/contexts/NetworkProvider'
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext'

/**
 * Shared contract and Immutable NFT providers for routes that render NFT data.
 *
 * Token balances are intentionally kept out of this boundary. They are only
 * needed by the dashboard overview, so routes such as rentals and profile
 * pages can load their own data without pulling in the extra token graph.
 */
export default function NFTDataProviders({ children }: PropsWithChildren) {
  if (process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true') {
    return <AuditFixtureContextWrapper>{children}</AuditFixtureContextWrapper>
  }

  return (
    <NetworkProvider>
      <IMXProvider>
        <NFTsBalanceProvider>{children}</NFTsBalanceProvider>
      </IMXProvider>
    </NetworkProvider>
  )
}
