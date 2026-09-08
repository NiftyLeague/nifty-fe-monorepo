'use client'

import { PROFILE_RENAME_API } from '@/constants/auth-urls'
import { useQuery } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

const useProfileRenameFee = (): { errorFee?: Error; fee?: number; loadingFee?: boolean } => {
  const { authToken } = useAuth()
  const scope = getAuthQueryScope(authToken)
  const { error, data, isLoading } = useQuery({
    queryKey: queryKeys.profile.renameFee(scope),
    queryFn: ({ signal }) =>
      fetchApiQuery<{ id: string; price: number }>(PROFILE_RENAME_API, {
        signal,
        init: { headers: { authorizationToken: authToken || '' } },
      }),
    enabled: !!authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })
  return { errorFee: error ?? undefined, fee: data?.price, loadingFee: isLoading }
}

export default useProfileRenameFee
