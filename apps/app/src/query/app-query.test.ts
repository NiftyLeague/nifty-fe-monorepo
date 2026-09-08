import { describe, expect, it, mock } from 'bun:test'

import { ApiQueryError, createAppQueryClient, fetchApiQuery, queryKeys } from './app-query'

describe('app query contract', () => {
  it('creates isolated clients with bounded server-state defaults', () => {
    const first = createAppQueryClient()
    const second = createAppQueryClient()

    expect(first).not.toBe(second)
    expect(first.getDefaultOptions().queries).toMatchObject({
      staleTime: 300_000,
      gcTime: 1_800_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    })

    const retry = first.getDefaultOptions().queries?.retry
    expect(typeof retry).toBe('function')
    if (typeof retry === 'function') {
      expect(retry(0, new ApiQueryError('Unauthorized', 401))).toBe(false)
      expect(retry(0, new ApiQueryError('Unavailable', 503))).toBe(true)
      expect(retry(1, new ApiQueryError('Unavailable', 503))).toBe(false)
    }
  })

  it('uses semantic keys without embedding auth credentials', () => {
    const key = queryKeys.profile.current('session-ab12')
    expect(key).toEqual(['profile', 'current', 'session-ab12'])
    expect(JSON.stringify(key)).not.toContain('authorizationToken')
  })

  it('provides semantic keys for every client-owned remote read', () => {
    expect(queryKeys.leaderboards.page('nifty_smashers', 'win_rate', 'all_time', 50, 0)).toEqual([
      'leaderboards',
      'page',
      'nifty_smashers',
      'win_rate',
      'all_time',
      50,
      0,
    ])
    expect(queryKeys.rentalPass('session-ab12')).toEqual([
      'rentals',
      'pass-balance',
      'session-ab12',
    ])
    expect(queryKeys.merkleClaim(1, '0xabc')).toEqual(['merkle-claim', 1, '0xabc'])
    expect(queryKeys.launcherVersion('prod', 'win')).toEqual([
      'launcher-version',
      'prod',
      'win',
    ])
  })

  it('deduplicates concurrent reads that share a semantic key', async () => {
    const client = createAppQueryClient()
    const queryFn = mock(async () => ({ id: 7 }))
    const options = { queryKey: queryKeys.publicDegens.byIds(['7']), queryFn }

    const [first, second] = await Promise.all([
      client.fetchQuery(options),
      client.fetchQuery(options),
    ])

    expect(first).toEqual({ id: 7 })
    expect(second).toEqual({ id: 7 })
    expect(queryFn).toHaveBeenCalledTimes(1)
  })

  it('forwards cancellation and rejects unsuccessful responses', async () => {
    const controller = new AbortController()
    const fetcher = mock((_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.signal).toBe(controller.signal)
      return Promise.resolve(
        new Response('unavailable', { status: 503, statusText: 'Unavailable' })
      )
    })

    await expect(
      fetchApiQuery('/api/example', { signal: controller.signal, fetcher })
    ).rejects.toThrow('Unavailable')
  })

  it('rejects successful HTTP responses that carry an application error', async () => {
    const fetcher = mock(() =>
      Promise.resolve(
        new Response(JSON.stringify({ statusCode: 400, body: 'Profile is unavailable' }), {
          status: 200,
        })
      )
    )

    await expect(fetchApiQuery('/api/profile', { fetcher })).rejects.toMatchObject({
      message: 'Profile is unavailable',
      status: 400,
    })
  })
})
