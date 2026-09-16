import { describe, expect, it } from 'bun:test'
import { act, renderHook } from '@nl/ui/test-utils'
import { mock } from 'bun:test'
import { createSignal, type Accessor, type JSX } from 'solid-js'
import { useQueryStates } from '@/url/nuqs-solid'

type UrlUpdate = {
  searchParams: URLSearchParams
  options: { history: 'push' | 'replace' }
}

interface TestingAdapter {
  search: Accessor<Record<string, string | string[] | undefined>>
  setSearch: (next: Record<string, string | string[] | undefined>) => void
  onUrlUpdate?: (event: UrlUpdate) => void
}

// The hook calls useSearch/useNavigate inside the wrapper's render scope, so
// the adapter registers itself and the router mocks capture it at call time.
let activeAdapter: TestingAdapter | undefined

mock.module('@tanstack/solid-router', () => ({
  useSearch: () => {
    const adapter = activeAdapter
    return () => adapter?.search() ?? {}
  },
  useNavigate: () => {
    const adapter = activeAdapter
    return async (args: {
      search: Record<string, string | string[] | undefined>
      replace?: boolean
    }) => {
      if (!adapter) return
      adapter.setSearch(args.search)
      const searchParams = new URLSearchParams()
      for (const [key, value] of Object.entries(args.search)) {
        if (value === undefined) continue
        searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value))
      }
      adapter.onUrlUpdate?.({
        searchParams,
        options: { history: args.replace ? 'replace' : 'push' },
      })
    }
  },
}))

const parseSearchParams = (input = ''): Record<string, string | string[]> => {
  const out: Record<string, string | string[]> = {}
  const params = new URLSearchParams(input)
  for (const [key, value] of params) {
    const existing = out[key]
    if (existing === undefined) out[key] = value
    else if (Array.isArray(existing)) existing.push(value)
    else out[key] = [existing, value]
  }
  return out
}

function withNuqsTestingAdapter(options: {
  searchParams?: string
  onUrlUpdate?: (event: UrlUpdate) => void
}) {
  return function TestingAdapterWrapper(props: { children?: JSX.Element }) {
    const [search, setSearch] = createSignal(parseSearchParams(options.searchParams))
    activeAdapter = { search, setSearch, onUrlUpdate: options.onUrlUpdate }
    return props.children
  }
}

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

  it('serializes separator-joined array params exactly as the parser reads them', async () => {
    const onUrlUpdate = mock()
    const { result } = renderHook(() => useQueryStates(degenSearchParsers), {
      wrapper: withNuqsTestingAdapter({ searchParams: '?tribes=Ape', onUrlUpdate }),
    })

    expect(result.current[0].tribes).toEqual(['Ape'])

    await act(async () => {
      await result.current[1]({ tribes: ['Ape', 'Cat'] })
    })
    // The '-' separator must be used or the value parses back as ['Ape,Cat'].
    expect(onUrlUpdate.mock.calls[0]?.[0]?.searchParams.get('tribes')).toBe('Ape-Cat')

    await act(async () => {
      await result.current[1]({ tribes: null })
    })
    // Resetting to the default clears the param to the serialized empty list.
    expect(onUrlUpdate.mock.calls[1]?.[0]?.searchParams.get('tribes')).toBe('')
  })

  it('treats undefined update values as no-ops', async () => {
    const onUrlUpdate = mock()
    const { result } = renderHook(() => useQueryStates(degenSearchParsers), {
      wrapper: withNuqsTestingAdapter({ searchParams: '?sort=idDown', onUrlUpdate }),
    })

    await act(async () => {
      await result.current[1]({ sort: undefined, page: 4 })
    })
    const update = onUrlUpdate.mock.calls[0]?.[0]?.searchParams
    expect(update?.get('sort')).toBe('idDown')
    expect(update?.get('page')).toBe('4')
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
