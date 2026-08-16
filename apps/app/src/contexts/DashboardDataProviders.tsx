'use client'

import type { PropsWithChildren } from 'react'

import NFTDataProviders from '@/contexts/NFTDataProviders'
import { TokensBalanceProvider } from '@/contexts/TokensBalanceContext'

/**
 * Dashboard-only data providers.
 *
 * Keep contract, Immutable, and balance clients out of the private shell so
 * auth-only pages can render without downloading the dashboard data graph.
 * Audit fixtures stay inside this same dashboard-scoped boundary.
 */
export default function DashboardDataProviders({ children }: PropsWithChildren) {
  return (
    <NFTDataProviders>
      <TokensBalanceProvider>{children}</TokensBalanceProvider>
    </NFTDataProviders>
  )
}
