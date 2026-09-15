'use client'

import { RENTAL_PASS_INVENTORY_URL } from '@/constants/url'
import { useQuery } from '@tanstack/solid-query'
import { errorMsgHandler } from '@/utils/errorHandlers'
import type { Accessor } from 'solid-js'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'
import useAuth from './useAuth'

const useRentalPassCount = (
  degenId: string | undefined | Accessor<string | undefined>
): [Accessor<boolean>, Accessor<string | null>, Accessor<number>] => {
  const auth = useAuth()
  const id = () => (typeof degenId === 'function' ? degenId() : degenId)
  const enabled = () => Boolean(id() && auth.authToken)
  const query = useQuery(() => ({
    queryKey: queryKeys.rentalPass(getAuthQueryScope(auth.authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<{ balance?: number }>(RENTAL_PASS_INVENTORY_URL, {
        signal,
        init: { method: 'GET', headers: { authorizationToken: auth.authToken || '' } },
      }),
    enabled: enabled(),
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))

  return [
    () => enabled() && query.isPending,
    () => (query.error ? errorMsgHandler(query.error) : null),
    () => query.data?.balance || 0,
  ]
}

export default useRentalPassCount
