import { renderHook } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import type { JSX } from 'solid-js'

import {
  arcadeBalanceQueryOptions,
  authedToken,
  gamerProfileQueryOptions,
  playerProfileQueryOptions,
  rentalsQueryOptions,
} from './authed-options'
import { getAuthQueryScope, queryKeys } from './app-query'
import { setIsLoggedIn } from '@/state/auth-store'
import { authTokenStore } from '@/state/auth-storage'

const fetchMock = mock()

describe('authed query options', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    mockRestoreFetch()
    setIsLoggedIn(false)
    authTokenStore.clear()
  })

  const mockRestoreFetch = () => {
    globalThis.fetch = fetchMock as typeof fetch
    fetchMock.mockImplementation(async () =>
      new Response(JSON.stringify({ name: 'Probe' }), { status: 200 })
    )
  }

  it('authedToken requires a logged-in session with a token', () => {
    expect(authedToken()).toBeUndefined()

    setIsLoggedIn(true)
    expect(authedToken()).toBeUndefined()

    authTokenStore.set('session-token')
    expect(authedToken()).toBe('session-token')

    setIsLoggedIn(false)
    expect(authedToken()).toBeUndefined()
  })

  it('keeps the exact cache keys the hooks have always used', () => {
    const token = 'session-token'
    expect(playerProfileQueryOptions(token).queryKey).toEqual(
      queryKeys.profile.player(getAuthQueryScope(token))
    )
    expect(gamerProfileQueryOptions(token).queryKey).toEqual(
      queryKeys.profile.current(getAuthQueryScope(token))
    )
    expect(arcadeBalanceQueryOptions(token).queryKey).toEqual(
      queryKeys.account.arcadeBalance(getAuthQueryScope(token))
    )
    expect(rentalsQueryOptions(token, 'all').queryKey).toEqual(
      queryKeys.rentals(getAuthQueryScope(token), 'all')
    )
  })

  it('serves a prefetched query to the consuming hook without a second fetch', async () => {
    const token = 'session-token'
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const options = gamerProfileQueryOptions(token)

    await queryClient.prefetchQuery(options)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const wrapper = (props: { children?: JSX.Element }) => (
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    )
    const { result } = renderHook(() => queryClient.getQueryData(options.queryKey), { wrapper })
    // The consuming hook resolves the same cache entry: still exactly one
    // fetch for this key across prefetch + render + ensureQueryData.
    await queryClient.ensureQueryData(options)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(result.current).toMatchObject({ name: 'Probe' })
    queryClient.clear()
  })
})
