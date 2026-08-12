const stubGlobal = (name, value) => {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}

import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { mock } from 'bun:test'

let fetchRankByUserId: typeof import('./leaderboard').fetchRankByUserId
let fetchClientScores: typeof import('./leaderboard').fetchScores
let fetchScores: typeof import('./leaderboard-server').fetchScores
let fetchUserNames: typeof import('./leaderboard-server').fetchUserNames
let getComparator: typeof import('./leaderboard').getComparator
let stableSort: typeof import('./leaderboard').stableSort

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
  fetchUserNames = leaderboardServer.fetchUserNames
  getComparator = leaderboard.getComparator
  stableSort = leaderboard.stableSort
})

afterEach(() => undefined)

describe('leaderboard data loaders', () => {
  it('loads usernames and handles transport errors', async () => {
    stubGlobal(
      'fetch',
      mock().mockResolvedValue({ json: mock().mockResolvedValue([{ name: 'Alpha' }]) })
    )
    await expect(fetchUserNames(['user-1'])).resolves.toEqual([{ name: 'Alpha' }])

    stubGlobal('fetch', mock().mockRejectedValue(new Error('offline')))
    await expect(fetchUserNames(['user-1'])).resolves.toEqual([])
  })

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

describe('leaderboard ordering', () => {
  const rows = [
    { rank: 2, user_id: 'b', score: '2', stats: { score: '2', wins: '3' } },
    { rank: 1, user_id: 'a', score: '2', stats: { score: '2', wins: '7' } },
    { rank: 3, user_id: 'c', score: '1', stats: { score: '1', wins: '7' } },
  ]

  it('supports rank and statistic comparators in both directions', () => {
    expect(
      stableSort(rows as never, getComparator('asc', 'rank' as never)).map((row) => row.rank)
    ).toEqual([1, 2, 3])
    expect(
      stableSort(rows as never, getComparator('desc', 'wins' as never)).map((row) => row.user_id)
    ).toEqual(['a', 'c', 'b'])
  })

  it('preserves source order when the comparator reports a tie', () => {
    expect(stableSort(rows, () => 0).map((row) => row.user_id)).toEqual(['b', 'a', 'c'])
  })
})
