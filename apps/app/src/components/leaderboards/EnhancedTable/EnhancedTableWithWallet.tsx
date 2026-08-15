'use client'

import type { TableProps } from '@/types/leaderboard'
import LeaderboardProviders from '@/contexts/LeaderboardProviders'
import EnhancedTable from './EnhancedTable'

export default function EnhancedTableWithWallet(props: TableProps) {
  return (
    <LeaderboardProviders>
      <EnhancedTable {...props} />
    </LeaderboardProviders>
  )
}
