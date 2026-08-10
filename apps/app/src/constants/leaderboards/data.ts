import { SMASHERS_LEADERBOARDS } from './leaderboard-smashers'
import { WEN_GAME_LEADERBOARDS } from './leaderboard-wen-game'
import { CRYPTO_WINTER_LEADERBOARDS } from './leaderboard-crypto-winter'
import { MT_GAWX_LEADERBOARDS } from './leaderboard-mt-gawx'

// Keep the archived datasets server-side. The browser only needs the selected page of rows.
export type LeaderboardRow = {
  rank: number
  user_id: string
  score: string
  stats: Record<string, string>
}

export const LEADERBOARDS: Record<string, Record<string, LeaderboardRow[]>> = {
  crypto_winter: CRYPTO_WINTER_LEADERBOARDS,
  nftl_burner: MT_GAWX_LEADERBOARDS,
  nifty_smashers: SMASHERS_LEADERBOARDS,
  wen_game: WEN_GAME_LEADERBOARDS,
}
