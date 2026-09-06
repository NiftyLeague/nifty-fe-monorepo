'use client'

import type { PropsWithChildren } from 'react'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import { IMXProvider } from '@/contexts/IMXContext'
import { NetworkProvider } from '@/contexts/NetworkProvider'
import { NFTsBalanceProvider } from '@/contexts/NFTsBalanceContext'
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext'

/**
 * Dashboard-only data providers.
 *
 * Keep contract, Immutable, and balance clients out of the private shell so
 * auth-only pages can render without downloading the dashboard data graph.
 * Audit fixtures stay inside this same dashboard-scoped boundary.
 */
export default function DashboardDataProviders({ children }: PropsWithChildren) {
  if (process.env.NEXT_PUBLIC_AUDIT_FIXTURE === 'true') {
    return <AuditFixtureContextWrapper>{children}</AuditFixtureContextWrapper>
  }

  return (
    <NetworkProvider>
      <IMXProvider>
        <NFTsBalanceProvider>
          <TokensBalanceProvider>{children}</TokensBalanceProvider>
        </NFTsBalanceProvider>
      </IMXProvider>
    </NetworkProvider>
  )
}
