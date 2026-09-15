'use client'

import { PROFILE_FAV_DEGENS_API } from '@/constants/auth-urls'
import { useQuery } from '@tanstack/solid-query'
import useAuth from '@/hooks/useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

/**
 * Shared favorites query definition. Every consumer reads the exact same
 * cache entry, whose key is scoped to the session token, so a logout/login
 * can never observe another session's favorites.
 */
export const profileFavoritesQueryOptions = (authToken?: string) => ({
  queryKey: queryKeys.profile.favorites(getAuthQueryScope(authToken)),
  queryFn: ({ signal }: { signal?: AbortSignal }) =>
    fetchApiQuery<{ favorites: string }>(PROFILE_FAV_DEGENS_API, {
      signal,
      init: { headers: { authorizationToken: authToken || '' } },
    }),
  enabled: !!authToken,
  staleTime: AUTHENTICATED_STALE_TIME_MS,
})

const useProfileFavDegens = (): {
  readonly error?: Error
  readonly favs?: string
  readonly loadingFavs?: boolean
} => {
  const auth = useAuth()
  const query = useQuery(() => profileFavoritesQueryOptions(auth.authToken))
  return {
    get error() {
      return (query.error as Error | undefined) ?? undefined
    },
    get favs() {
      return query.data?.favorites
    },
    get loadingFavs() {
      return query.isLoading
    },
  }
}

export default useProfileFavDegens
