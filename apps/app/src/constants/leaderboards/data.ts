// Keep the archived datasets server-side. The browser only needs the selected page of rows.
export type LeaderboardRow = {
  rank: number
  user_id: string
  score: string
  stats: Record<string, string>
}

type LeaderboardData = Record<string, LeaderboardRow[]>

export const loadLeaderboard = async (gameType: string): Promise<LeaderboardData | undefined> => {
  switch (gameType) {
    case 'crypto_winter':
      return (await import('./leaderboard-crypto-winter')).CRYPTO_WINTER_LEADERBOARDS
    case 'nftl_burner':
      return (await import('./leaderboard-mt-gawx')).MT_GAWX_LEADERBOARDS
    case 'nifty_smashers':
      return (await import('./leaderboard-smashers')).SMASHERS_LEADERBOARDS
    case 'wen_game':
      return (await import('./leaderboard-wen-game')).WEN_GAME_LEADERBOARDS
    default:
      return undefined
  }
}
