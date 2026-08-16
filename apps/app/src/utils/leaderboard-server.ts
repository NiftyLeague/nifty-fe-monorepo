import { LEADERBOARD_USERNAMES_API_URL } from '@/constants/url'
import { loadLeaderboard, type LeaderboardRow } from '@/constants/leaderboards/data'

type UserName = { name?: string }
type UserNames = Record<string, UserName> | UserName[]
type ScoredLeaderboardRow = Omit<LeaderboardRow, 'stats'> & {
  stats: Record<string, string | number>
}
type LeaderboardResponse = { data: ScoredLeaderboardRow[]; count: number }

export const fetchUserNames = async (items: string[]): Promise<UserNames> => {
  try {
    const res = await fetch(`${LEADERBOARD_USERNAMES_API_URL}?ids=${items}&include_stats=false`, {
      cache: 'no-store',
    })
    return await res.json()
  } catch {
    return []
  }
}

export const fetchScores = async (
  gameType: string,
  scoreType: string,
  _timeFilter: string,
  count: number,
  offset: number
): Promise<LeaderboardResponse> => {
  const leaderboard = (await loadLeaderboard(gameType))?.[scoreType]

  if (!leaderboard || !Array.isArray(leaderboard)) {
    throw new Error('Unknown leaderboard')
  }

  const json = { data: leaderboard.slice(offset, offset + count), count: leaderboard.length }

  const addAvg = json.data.map((data) => {
    const { earnings, matches } = data?.stats || {}
    const avg =
      earnings && matches ? Math.round((parseFloat(earnings) * 100) / parseFloat(matches)) / 100 : 0
    let rate = 0
    let earningsParsed = Math.round(parseFloat(earnings || '0') * 10) / 10
    let kills = Number(data.stats?.kills ?? '0')
    switch (scoreType) {
      case 'win_rate':
        rate = parseFloat(data.score) * 100
        break
      case 'earnings':
        earningsParsed = Number(data.score)
        break
      case 'kills':
        kills = Number(data.score)
        break
      default:
        break
    }
    return {
      ...data,
      stats: {
        ...data.stats,
        score: Number(data.score ?? '0').toLocaleString(),
        'avg_NFTL/match': avg,
        win_rate: `${rate}%`,
        earnings: earningsParsed.toLocaleString(),
        kills: kills.toLocaleString(),
      },
    }
  })

  const items = json.data.map((data) => data.user_id)
  const namesByUserId = new Map(Object.entries(await fetchUserNames(items)))
  for (const row of addAvg) {
    const match = namesByUserId.get(row.user_id)
    if (match) row.user_id = match.name || ''
  }

  return { data: addAvg, count: json.count }
}
