'use client'

import type { TableProps } from '@/types/leaderboard'
import WalletFeatureProviders from '@/contexts/WalletFeatureProviders'
import EnhancedTable from './EnhancedTable'

export default function EnhancedTableWithWallet(props: TableProps) {
  return (
    <WalletFeatureProviders>
      <EnhancedTable {...props} />
    </WalletFeatureProviders>
  )
}
