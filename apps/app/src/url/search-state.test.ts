import { describe, expect, it } from 'bun:test'
import { act, renderHook } from '@testing-library/react'
import { mock } from 'bun:test'
import { useQueryStates } from 'nuqs'
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing'

import {
  normalizeDegenSearchState,
  normalizeLeaderboardGame,
  toDegenFilter,
  degenSearchParsers,
  leaderboardSearchParsers,
  rentalSearchParsers,
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

  it('derives the complete DEGEN filter without a component-state mirror', () => {
    const defaults = {
      prices: [1, 100],
      multipliers: ['default-multiplier'],
      rentals: [],
      tribes: ['default-tribe'],
      backgrounds: [],
      cosmetics: [],
      wearables: [],
      sort: 'idUp',
      tokenId: [],
      searchTerm: [''],
      walletAddress: [],
    }

    expect(
      toDegenFilter(
        normalizeDegenSearchState({
          prices: [20, 40],
          tribes: ['ape'],
          searchTerm: 'alpha',
          sort: 'idDown',
        }),
        defaults
      )
    ).toMatchObject({
      prices: [20, 40],
      tribes: ['ape'],
      searchTerm: ['alpha'],
      sort: 'idDown',
    })
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

  it('hydrates shareable layout and table pagination state', () => {
    const degen = renderHook(() => useQueryStates(degenSearchParsers), {
      wrapper: withNuqsTestingAdapter({ searchParams: '?layout=gridOn' }),
    })
    expect(degen.result.current[0].layout).toBe('gridOn')

    const leaderboard = renderHook(() => useQueryStates(leaderboardSearchParsers), {
      wrapper: withNuqsTestingAdapter({ searchParams: '?page=3' }),
    })
    expect(leaderboard.result.current[0].page).toBe(3)

    const rentals = renderHook(() => useQueryStates(rentalSearchParsers), {
      wrapper: withNuqsTestingAdapter({
        searchParams: '?page=4&pageSize=25&sort=netEarning&direction=desc',
      }),
    })
    expect(rentals.result.current[0]).toMatchObject({
      page: 4,
      pageSize: '25',
      sort: 'netEarning',
      direction: 'desc',
    })
  })
})
