'use client'

import { PROFILE_FAV_DEGENS_API } from '@/constants/auth-urls'
import { useQuery } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

const useProfileFavDegens = (): { error?: Error; favs?: string; loadingFavs?: boolean } => {
  const { authToken } = useAuth()
  const scope = getAuthQueryScope(authToken)
  const { error, data, isLoading } = useQuery({
    queryKey: queryKeys.profile.favorites(scope),
    queryFn: ({ signal }) =>
      fetchApiQuery<{ favorites: string }>(PROFILE_FAV_DEGENS_API, {
        signal,
        init: { headers: { authorizationToken: authToken || '' } },
      }),
    enabled: !!authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })
  return { error: error ?? undefined, favs: data?.favorites, loadingFavs: isLoading }
}

export default useProfileFavDegens
