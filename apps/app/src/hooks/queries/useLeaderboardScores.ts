'use client'

import { keepPreviousData, useQuery } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import { queryKeys } from '@/query/app-query'
import { fetchScores } from '@/utils/leaderboard'

const resolve = <T,>(value: T | Accessor<T>): T =>
  typeof value === 'function' ? (value as Accessor<T>)() : value

export const useLeaderboardScores = (
  game: string | Accessor<string>,
  score: string | Accessor<string>,
  time: string | Accessor<string>,
  count: number | Accessor<number>,
  offset: number | Accessor<number>,
  enabled: boolean | Accessor<boolean> = true
) =>
  useQuery(() => {
    const g = resolve(game)
    const s = resolve(score)
    const t = resolve(time)
    const c = resolve(count)
    const o = resolve(offset)
    return {
      queryKey: queryKeys.leaderboards.page(g, s, t, c, o),
      queryFn: ({ signal }) => fetchScores(g, s, t, c, o, signal),
      enabled: resolve(enabled),
      placeholderData: keepPreviousData,
    }
  })
