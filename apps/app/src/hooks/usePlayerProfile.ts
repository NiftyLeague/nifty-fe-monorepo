'use client'

import { MY_PROFILE_API_URL } from '@/constants/url'
import { useQuery } from '@tanstack/solid-query'
import type { Profile } from '@/types/account'
import useAuth from './useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

const usePlayerProfile = (): {
  readonly error?: Error
  readonly profile?: Profile
  readonly loadingProfile?: boolean
} => {
  const auth = useAuth()
  const query = useQuery(() => ({
    queryKey: queryKeys.profile.player(getAuthQueryScope(auth.authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<Profile>(MY_PROFILE_API_URL, {
        signal,
        init: { headers: { authorizationToken: auth.authToken || '' } },
      }),
    enabled: !!auth.authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))
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
  }
}

export default usePlayerProfile
