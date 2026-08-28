const stubGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}

import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'

let fetchRankByUserId: typeof import('./leaderboard').fetchRankByUserId
let fetchClientScores: typeof import('./leaderboard').fetchScores
let fetchScores: typeof import('./leaderboard-server').fetchScores

beforeEach(async () => {
  mock.module('@/constants/leaderboards/data', () => {
    const row = (score: string, userId: string, stats: Record<string, string> = {}) => ({
      rank: 1,
      score,
      user_id: userId,
      stats: { earnings: '12.5', matches: '5', kills: '3', ...stats },
    })
    const leaderboards: Record<string, Record<string, ReturnType<typeof row>[]>> = {
      smashers: {
        win_rate: [row('0.75', 'user-1')],
        earnings: [row('99.1', 'user-2')],
        kills: [row('11', 'user-3')],
        score: [row('4', 'user-4', { earnings: '', matches: '' })],
      },
      bulk: {
        win_rate: [row('0.75', 'user-1'), row('0.5', 'user-2')],
      },
      empty: {
        win_rate: [],
      },
    }
    return {
      loadLeaderboard: async (gameType: string) => leaderboards[gameType],
    }
  })

  const [leaderboard, leaderboardServer] = await Promise.all([
    import('./leaderboard'),
    import('./leaderboard-server'),
  ])
  fetchRankByUserId = leaderboard.fetchRankByUserId
  fetchClientScores = leaderboard.fetchScores
  fetchScores = leaderboardServer.fetchScores
})

afterEach(() => undefined)

describe('leaderboard data loaders', () => {
  it('requests only the selected leaderboard page from the app route', async () => {
    const fetchMock = mock().mockResolvedValue({
      ok: true,
      json: mock().mockResolvedValue({ data: [], count: 0 }),
    })
    stubGlobal('fetch', fetchMock)

    await fetchClientScores('smashers', 'kills', 'all_time', 50, 100)

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      '/api/leaderboards?game=smashers&score=kills&time=all_time&count=50&offset=100'
    )
  })

  it.each<[string, string, string, string]>([
    ['win_rate', '75%', '12.5', '3'],
    ['earnings', '0%', '99.1', '3'],
    ['kills', '0%', '12.5', '11'],
    ['score', '0%', '0', '3'],
  ])('normalizes %s score rows', async (scoreType, winRate, earnings, kills) => {
    stubGlobal(
      'fetch',
      mock().mockResolvedValue({
        json: mock().mockResolvedValue({ [`user-${scoreType}`]: { name: 'Player' } }),
      })
    )

    const result = await fetchScores('smashers', scoreType, 'all', 5, 0)
    expect(result.count).toBe(1)
    expect(result.data[0]?.stats).toMatchObject({ win_rate: winRate, earnings, kills })
    expect((result.data[0]?.stats as unknown as Record<string, string>).score).toBeTruthy()
  })

  it('enriches multiple rows through keyed username lookups', async () => {
    stubGlobal(
      'fetch',
      mock().mockResolvedValue({
        json: mock().mockResolvedValue({
          'user-1': { name: 'Alpha' },
          'user-2': { name: 'Bravo' },
        }),
      })
    )

    const result = await fetchScores('bulk', 'win_rate', 'all', 2, 0)

    expect(result.data.map((row) => row.user_id)).toEqual(['Alpha', 'Bravo'])
  })

  it('keeps leaderboard rows when username enrichment is unavailable', async () => {
    stubGlobal('fetch', mock().mockRejectedValue(new Error('offline')))

    const result = await fetchScores('smashers', 'kills', 'all', 1, 0)

    expect(result.data[0]?.user_id).toBe('user-3')
  })

  it('does not request usernames when the selected leaderboard page is empty', async () => {
    const fetchMock = mock().mockRejectedValue(new Error('should not be called'))
    stubGlobal('fetch', fetchMock)

    await expect(fetchScores('empty', 'win_rate', 'all', 2, 0)).resolves.toEqual({
      data: [],
      count: 0,
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns rank responses and caught rank errors', async () => {
    const response = new Response('{}', { status: 200 })
    const fetchMock = mock().mockResolvedValue(response)
    stubGlobal('fetch', fetchMock)
    await expect(fetchRankByUserId('user-1', 'smashers', 'wins', 'week')).resolves.toBe(response)
    expect(fetchMock.mock.calls[0]?.[0]).toContain('user_id=user-1')

    const error = new Error('offline')
    stubGlobal('fetch', mock().mockRejectedValue(error))
    await expect(fetchRankByUserId('user-1', 'smashers', 'wins', 'week')).resolves.toBe(error)
  })
})
