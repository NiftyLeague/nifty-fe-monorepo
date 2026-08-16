import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

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

    const { rerender } = render(<TopModal {...baseProps} />)
    await act(async () => {
      await Promise.resolve()
    })

    expect(fetchScores).toHaveBeenCalledTimes(1)
    expect(fetchCalls[0]).toEqual(['nifty_smashers', 'score', 'all_time', 10, 2])

    rerender(<TopModal {...baseProps} selectedGame="nifty_rivals" />)
    await act(async () => {
      await Promise.resolve()
    })

    expect(fetchScores).toHaveBeenCalledTimes(2)
    expect(fetchCalls[1]).toEqual(['nifty_rivals', 'score', 'all_time', 10, 2])
  })
})
