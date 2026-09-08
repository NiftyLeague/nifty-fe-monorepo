'use client'

import type { ProfileAvatar } from '@/types/account'
import { useQuery } from '@tanstack/react-query'
import { GET_PROFILE_AVATARS_AND_COST_API } from '@/constants/auth-urls'
import useAuth from '@/hooks/useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'

interface ProfileAvatarsRes {
  id: string
  avatars: ProfileAvatar[]
  price: number
}
const useProfileAvatarFee = (): {
  errorAvatarsAndFee?: Error
  avatarsAndFee?: ProfileAvatarsRes
  loadingAvatarsAndFee?: boolean
} => {
  const { authToken } = useAuth()
  const scope = getAuthQueryScope(authToken)
  const { error, data, isLoading } = useQuery({
    queryKey: queryKeys.profile.avatars(scope),
    queryFn: ({ signal }) =>
      fetchApiQuery<ProfileAvatarsRes>(GET_PROFILE_AVATARS_AND_COST_API, {
        signal,
        init: { headers: { authorizationToken: authToken || '' } },
      }),
    enabled: !!authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  })
  return {
    errorAvatarsAndFee: error ?? undefined,
    avatarsAndFee: data,
    loadingAvatarsAndFee: isLoading,
  }
}

export default useProfileAvatarFee
