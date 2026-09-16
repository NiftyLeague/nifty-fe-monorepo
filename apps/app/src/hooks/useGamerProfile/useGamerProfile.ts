import { GET_GAMER_PROFILE_API } from '@/constants/api'
import { useQuery } from '@tanstack/solid-query'
import useAuth from '@/hooks/useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'
import type { Profile } from '@/types/account'

const useGamerProfile = (): {
  readonly error?: Error
  readonly profile?: Profile
  readonly loadingProfile?: boolean
  fetchUserProfile?: () => Promise<Profile>
} => {
  const auth = useAuth()

  const query = useQuery(() => ({
    queryKey: queryKeys.profile.current(getAuthQueryScope(auth.authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<Profile>(GET_GAMER_PROFILE_API, {
        signal,
        init: { headers: { authorizationToken: auth.authToken || '' } },
      }),
    enabled: auth.isLoggedIn && !!auth.authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))

  const fetchUserProfile = async () => {
    const result = await query.refetch({ throwOnError: true })
    if (!result.data) throw new Error('Profile unavailable')
    return result.data
  }

  return {
    get error() {
      return (query.error as Error | undefined) ?? undefined
    },
    get profile() {
      return query.data
    },
    get loadingProfile() {
      return query.isLoading
    },
    fetchUserProfile,
  }
}

export default useGamerProfile
