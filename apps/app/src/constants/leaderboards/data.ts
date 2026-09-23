import { CDN_BASE_URL } from '@/constants/api'

// Archived competition datasets are frozen snapshots: they live on the CDN
// (cache/leaderboards/<gameType>.json) and load from the edge instead of
// weighing down the app bundle. Unknown games resolve to undefined.
export type LeaderboardRow = {
  rank: number
  user_id: string
  score: string
  stats: Record<string, string>
}

type LeaderboardData = Record<string, LeaderboardRow[]>

const ARCHIVED_GAMES = new Set(['crypto_winter', 'nftl_burner', 'nifty_smashers', 'wen_game'])

export const loadLeaderboard = async (gameType: string): Promise<LeaderboardData | undefined> => {
  if (!ARCHIVED_GAMES.has(gameType)) return undefined

  const response = await fetch(`${CDN_BASE_URL}/cache/leaderboards/${gameType}.json`)
  if (!response.ok) {
    throw new Error(`Failed to load leaderboard: ${response.status}`)
  }
  return (await response.json()) as LeaderboardData
}
