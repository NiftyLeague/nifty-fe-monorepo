import { QueryClientProvider } from '@tanstack/react-query'
import { render, waitFor } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import { createAppQueryClient } from '@/query/app-query'

const fetchScores = mock(() => Promise.resolve({ data: [], count: 0 }))
mock.module('@/utils/leaderboard', () => ({ fetchScores }))
mock.module('@/components/ResponsiveTable', () => ({
  ResponsiveTable: () => <div>table</div>,
}))
mock.module('../LeaderboardRankBoundary', () => ({ default: () => null }))

const EnhancedTable = (await import('./EnhancedTable')).default

describe('leaderboard table query ownership', () => {
  it('deduplicates identical page reads across consumers', async () => {
    const client = createAppQueryClient()
    const props = {
      selectedGame: 'nifty_smashers',
      selectedTable: { key: 'win_rate', display: 'Win rate', rows: [] },
      selectedTimeFilter: 'all_time',
    }

    render(
      <QueryClientProvider client={client}>
        <EnhancedTable {...props} />
        <EnhancedTable {...props} />
      </QueryClientProvider>
    )

    await waitFor(() => expect(fetchScores).toHaveBeenCalledTimes(1))
  })
})
