'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/query/app-query'
import { fetchScores } from '@/utils/leaderboard'

export const useLeaderboardScores = (
  game: string,
  score: string,
  time: string,
  count: number,
  offset: number,
  enabled = true
) =>
  useQuery({
    queryKey: queryKeys.leaderboards.page(game, score, time, count, offset),
    queryFn: ({ signal }) => fetchScores(game, score, time, count, offset, signal),
    enabled,
    placeholderData: keepPreviousData,
  })
