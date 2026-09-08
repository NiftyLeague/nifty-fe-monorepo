'use client'

import { RENTAL_PASS_INVENTORY_URL } from '@/constants/url'
import { useQuery } from '@tanstack/react-query'
import { errorMsgHandler } from '@/utils/errorHandlers'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'
import useAuth from './useAuth'

const useRentalPassCount = (degenId: string | undefined): [boolean, string | null, number] => {
  const { authToken } = useAuth()
  const enabled = Boolean(degenId && authToken)
  const { data, error, isPending } = useQuery({
    queryKey: queryKeys.rentalPass(getAuthQueryScope(authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<{ balance?: number }>(RENTAL_PASS_INVENTORY_URL, {
        signal,
        init: { method: 'GET', headers: { authorizationToken: authToken || '' } },
      }),
    enabled,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })

  return [enabled && isPending, error ? errorMsgHandler(error) : null, data?.balance || 0]
}

export default useRentalPassCount
