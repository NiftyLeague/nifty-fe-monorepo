import type { ReturnDataType } from '@/types/leaderboard'
import { GET_RANK_BY_USER_ID_API } from '@/constants/url'
import { ApiQueryError } from '@/query/app-query'

export const fetchScores = async (
  gameType: string,
  scoreType: string,
  timeFilter: string,
  count: number,
  offset: number,
  signal?: AbortSignal
): Promise<ReturnDataType> => {
  const response = await fetch(
    `/api/leaderboards?${new URLSearchParams({
      game: gameType,
      score: scoreType,
      time: timeFilter,
      count: String(count),
      offset: String(offset),
    })}`,
    { cache: 'no-store', signal }
  )
  if (!response.ok) throw new Error('Unable to load leaderboard')
  return response.json()
}

export const fetchRankByUserId = async (
  userId: string,
  game: string,
  scoreType: string,
  timeFilter: string,
  signal?: AbortSignal
): Promise<number> => {
  const response = await fetch(
    `${GET_RANK_BY_USER_ID_API}?${new URLSearchParams({
      user_id: userId,
      game,
      time_window: timeFilter,
      score_type: scoreType,
    })}`,
    { cache: 'no-store', signal }
  )
  const body = await response.text()
  if (!response.ok) {
    throw new ApiQueryError(body || response.statusText || 'Unable to load rank', response.status)
  }
  return Number(body)
}
