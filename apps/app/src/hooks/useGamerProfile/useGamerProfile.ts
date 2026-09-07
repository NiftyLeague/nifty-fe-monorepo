'use client'

import { GET_GAMER_PROFILE_API } from '@/constants/api'
import { useQuery } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'
import type { Profile } from '@/types/account'

const useGamerProfile = (): {
  error?: Error
  profile?: Profile
  loadingProfile?: boolean
  fetchUserProfile?: () => Promise<Profile>
} => {
  const { isLoggedIn, authToken } = useAuth()
  const scope = getAuthQueryScope(authToken)

  const { error, data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.profile.current(scope),
    queryFn: ({ signal }) =>
      fetchApiQuery<Profile>(GET_GAMER_PROFILE_API, {
        signal,
        init: { headers: { authorizationToken: authToken || '' } },
      }),
    enabled: isLoggedIn && !!authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })

  const fetchUserProfile = async () => {
    const result = await refetch({ throwOnError: true })
    if (!result.data) throw new Error('Profile unavailable')
    return result.data
  }

  return { error: error ?? undefined, profile: data, loadingProfile: isLoading, fetchUserProfile }
}

export default useGamerProfile
