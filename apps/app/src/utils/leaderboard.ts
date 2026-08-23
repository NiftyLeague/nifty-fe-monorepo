import type { ReturnDataType } from '@/types/leaderboard'
import { GET_RANK_BY_USER_ID_API } from '@/constants/url'

export const fetchScores = async (
  gameType: string,
  scoreType: string,
  timeFilter: string,
  count: number,
  offset: number
): Promise<ReturnDataType> => {
  const response = await fetch(
    `/api/leaderboards?${new URLSearchParams({
      game: gameType,
      score: scoreType,
      time: timeFilter,
      count: String(count),
      offset: String(offset),
    })}`,
    { cache: 'no-store' }
  )
  if (!response.ok) throw new Error('Unable to load leaderboard')
  return response.json()
}

export const fetchRankByUserId = async (
  userId: string,
  game: string,
  scoreType: string,
  timeFilter: string
): Promise<Response | unknown> => {
  try {
    const res = await fetch(
      `${GET_RANK_BY_USER_ID_API}?${new URLSearchParams({
        user_id: userId,
        game,
        time_window: timeFilter,
        score_type: scoreType,
      })}`
    )
    return res
  } catch (e) {
    return e
  }
}
