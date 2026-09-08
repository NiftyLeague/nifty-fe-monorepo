import { render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { QueryClientProvider } from '@tanstack/react-query'

import { createAppQueryClient } from '@/query/app-query'

const fetchCalls: unknown[][] = []
const fetchScores = mock((...args: unknown[]) => {
  fetchCalls.push(args)
  return Promise.resolve({ data: [] })
})

beforeEach(() => {
  fetchCalls.length = 0
  fetchScores.mockClear()
  mock.module('@/utils/leaderboard', () => ({ fetchScores }))
  mock.module('./CustomModal', () => ({
    default: ({ child }: { child: React.ReactNode }) => <>{child}</>,
  }))
  mock.module('next/image', () => ({
    default: ({ alt }: { alt?: string }) => <span data-image-alt={alt ?? ''} />,
  }))
})

afterEach(() => {
  mock.restore()
})

describe('leaderboard rank dialog data', () => {
  it('refetches when the selected leaderboard changes', async () => {
    const TopModal = (await import('./TopModal')).default
    const baseProps = {
      flag: 'score',
      myRank: 5,
      onOpenChange: mock(),
      open: true,
      selectedGame: 'nifty_smashers',
      selectedTimeFilter: 'all_time',
    }

    const client = createAppQueryClient()
    const { rerender } = render(
      <QueryClientProvider client={client}>
        <TopModal {...baseProps} />
      </QueryClientProvider>
    )
    await waitFor(() => expect(fetchScores).toHaveBeenCalledTimes(1))

    expect(fetchCalls[0]?.slice(0, 5)).toEqual(['nifty_smashers', 'score', 'all_time', 10, 2])

    rerender(
      <QueryClientProvider client={client}>
        <TopModal {...baseProps} selectedGame="nifty_rivals" />
      </QueryClientProvider>
    )
    await waitFor(() => expect(fetchScores).toHaveBeenCalledTimes(2))

    expect(fetchCalls[1]?.slice(0, 5)).toEqual(['nifty_rivals', 'score', 'all_time', 10, 2])
  })

  it('deduplicates identical leaderboard reads across consumers', async () => {
    const TopModal = (await import('./TopModal')).default
    const client = createAppQueryClient()
    const props = {
      flag: 'score',
      myRank: 5,
      onOpenChange: mock(),
      open: true,
      selectedGame: 'nifty_smashers',
      selectedTimeFilter: 'all_time',
    }

    render(
      <QueryClientProvider client={client}>
        <TopModal {...props} />
        <TopModal {...props} />
      </QueryClientProvider>
    )
    await waitFor(() => expect(fetchScores).toHaveBeenCalledTimes(1))
  })
})
