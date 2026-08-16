// Keep the archived datasets server-side. JSON keeps the large snapshots out of
// the TypeScript parser while the browser still receives only the selected page.
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
      return (await import('./leaderboard-crypto-winter.json')).default
    case 'nftl_burner':
      return (await import('./leaderboard-mt-gawx.json')).default
    case 'nifty_smashers':
      return (await import('./leaderboard-smashers.json')).default
    case 'wen_game':
      return (await import('./leaderboard-wen-game.json')).default
    default:
      return undefined
  }
}
