'use client'

import { MY_PROFILE_API_URL } from '@/constants/url'
import { useQuery } from '@tanstack/react-query'
import type { Profile } from '@/types/account'
import useAuth from './useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

const usePlayerProfile = (): { error?: Error; profile?: Profile; loadingProfile?: boolean } => {
  const { authToken } = useAuth()
  const scope = getAuthQueryScope(authToken)
  const { error, data, isLoading } = useQuery({
    queryKey: queryKeys.profile.player(scope),
    queryFn: ({ signal }) =>
      fetchApiQuery<Profile>(MY_PROFILE_API_URL, {
        signal,
        init: { headers: { authorizationToken: authToken || '' } },
      }),
    enabled: !!authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })
  return { error: error ?? undefined, profile: data, loadingProfile: isLoading }
}

export default usePlayerProfile
