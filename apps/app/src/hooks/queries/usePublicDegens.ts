'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { PUBLIC_DEGENS_API_URL, getPublicDegensByIdsUrl } from '@/constants/api'
import { fetchApiQuery, PUBLIC_STALE_TIME_MS, queryKeys } from '@/query/app-query'
import type { DashboardDegen } from '@/types/degens'
import { PUBLIC_DEGENS_WIRE_MEDIA_TYPE, type PublicDegenPageWire } from '@/utils/public-degens'

export const usePublicDegensPage = (query: string) => {
  const url = `${PUBLIC_DEGENS_API_URL}?${query}`
  return useQuery({
    queryKey: queryKeys.publicDegens.list(query),
    queryFn: ({ signal }) =>
      fetchApiQuery<PublicDegenPageWire>(url, {
        signal,
        init: { headers: { Accept: PUBLIC_DEGENS_WIRE_MEDIA_TYPE } },
      }),
    staleTime: PUBLIC_STALE_TIME_MS,
    // Keep the previous page rendered while a new filter/page/search key
    // loads, so typing or paging never blanks the grid into skeletons.
    placeholderData: keepPreviousData,
  })
}

export const usePublicDegensByIds = (ids: string[]) => {
  const url = ids.length ? getPublicDegensByIdsUrl(ids) : undefined
  return useQuery({
    queryKey: queryKeys.publicDegens.byIds(ids),
    queryFn: ({ signal }) => fetchApiQuery<DashboardDegen[]>(url as string, { signal }),
    enabled: Boolean(url),
    staleTime: PUBLIC_STALE_TIME_MS,
  })
}
