'use client'

import type { ParentProps } from 'solid-js'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import { IMXProvider } from '@/contexts/IMXContext'
import { NetworkProvider } from '@/contexts/NetworkProvider'
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext'
import { AUDIT_FIXTURE } from '@/runtime/env'

/**
 * Shared contract and Immutable NFT providers for routes that render NFT data.
 *
 * Token balances are intentionally kept out of this boundary. They are only
 * needed by the dashboard overview, so routes such as rentals and profile
 * pages can load their own data without pulling in the extra token graph.
 */
export default function NFTDataProviders(props: ParentProps) {
  if (AUDIT_FIXTURE) {
    return <AuditFixtureContextWrapper>{props.children}</AuditFixtureContextWrapper>
  }

  return (
    <NetworkProvider>
      <IMXProvider>
        <NFTsBalanceProvider>{props.children}</NFTsBalanceProvider>
      </IMXProvider>
    </NetworkProvider>
  )
}
