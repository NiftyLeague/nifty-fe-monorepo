import { PROFILE_RENAME_API } from '@/constants/auth-urls'
import { useQuery } from '@tanstack/solid-query'
import useAuth from '@/hooks/useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

const useProfileRenameFee = (): {
  readonly errorFee?: Error
  readonly fee?: number
  readonly loadingFee?: boolean
} => {
  const auth = useAuth()
  const query = useQuery(() => ({
    queryKey: queryKeys.profile.renameFee(getAuthQueryScope(auth.authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<{ id: string; price: number }>(PROFILE_RENAME_API, {
        signal,
        init: { headers: { authorizationToken: auth.authToken || '' } },
      }),
    enabled: !!auth.authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))
  return {
    get errorFee() {
      return (query.error as Error | undefined) ?? undefined
    },
    get fee() {
      return query.data?.price
    },
    get loadingFee() {
      return query.isLoading
    },
  }
}

export default useProfileRenameFee
