import { describe, expect, it } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { mock } from 'bun:test'
import { useQueryStates } from 'nuqs'
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing'

import {
  normalizeDegenSearchState,
  normalizeLeaderboardGame,
  degenSearchParsers,
  type DegenSearchState,
} from './search-state'

describe('typed URL state', () => {
  it('normalizes invalid catalogue values to safe defaults', () => {
    expect(
      normalizeDegenSearchState({
        page: -4,
        sort: 'unexpected',
        searchTerm: '  ape  ',
        tribes: ['ape', '', 'ape'],
      } as DegenSearchState)
    ).toMatchObject({ page: 1, sort: 'idUp', searchTerm: 'ape', tribes: ['ape'] })
  })

  it('accepts only supported leaderboard games', () => {
    expect(normalizeLeaderboardGame('nifty_smashers')).toBe('nifty_smashers')
    expect(normalizeLeaderboardGame('not-a-game')).toBe('nifty_smashers')
  })

  it('hydrates from a deep link and emits push-history updates', async () => {
    const onUrlUpdate = mock()
    const { result } = renderHook(() => useQueryStates(degenSearchParsers), {
      wrapper: withNuqsTestingAdapter({
        searchParams: '?page=2&sort=idDown&tribes=Ape-Cat',
        onUrlUpdate,
      }),
    })

    expect(result.current[0]).toMatchObject({ page: 2, sort: 'idDown', tribes: ['Ape', 'Cat'] })

    await act(async () => {
      await result.current[1]({ page: 3 }, { history: 'push' })
    })
    expect(onUrlUpdate).toHaveBeenCalledTimes(1)
    expect(onUrlUpdate.mock.calls[0]?.[0]?.searchParams.get('page')).toBe('3')
    expect(onUrlUpdate.mock.calls[0]?.[0]?.options.history).toBe('push')
  })
})
