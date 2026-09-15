'use client'

import { keepPreviousData, useQuery } from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

import { PUBLIC_DEGENS_API_URL, getPublicDegensByIdsUrl } from '@/constants/api'
import { fetchApiQuery, PUBLIC_STALE_TIME_MS, queryKeys } from '@/query/app-query'
import type { DashboardDegen } from '@/types/degens'
import { PUBLIC_DEGENS_WIRE_MEDIA_TYPE, type PublicDegenPageWire } from '@/utils/public-degens'

const resolve = <T>(value: T | Accessor<T>): T =>
  typeof value === 'function' ? (value as Accessor<T>)() : value

export const usePublicDegensPage = (query: string | Accessor<string>) => {
  return useQuery(() => {
    const q = resolve(query)
    return {
      queryKey: queryKeys.publicDegens.list(q),
      queryFn: ({ signal }) =>
        fetchApiQuery<PublicDegenPageWire>(`${PUBLIC_DEGENS_API_URL}?${q}`, {
          signal,
          init: { headers: { Accept: PUBLIC_DEGENS_WIRE_MEDIA_TYPE } },
        }),
      staleTime: PUBLIC_STALE_TIME_MS,
      // Keep the previous page rendered while a new filter/page/search key
      // loads, so typing or paging never blanks the grid into skeletons.
      placeholderData: keepPreviousData,
    }
  })
}

export const usePublicDegensByIds = (ids: string[] | Accessor<string[]>) => {
  return useQuery(() => {
    const resolved = resolve(ids)
    const url = resolved.length ? getPublicDegensByIdsUrl(resolved) : undefined
    return {
      queryKey: queryKeys.publicDegens.byIds(resolved),
      queryFn: ({ signal }) => fetchApiQuery<DashboardDegen[]>(url as string, { signal }),
      enabled: Boolean(url),
      staleTime: PUBLIC_STALE_TIME_MS,
    }
  })
}
