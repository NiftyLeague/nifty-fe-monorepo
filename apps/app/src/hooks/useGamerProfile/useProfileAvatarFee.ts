import type { ProfileAvatar } from '@/types/account'
import { useQuery } from '@tanstack/solid-query'
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
  readonly errorAvatarsAndFee?: Error
  readonly avatarsAndFee?: ProfileAvatarsRes
  readonly loadingAvatarsAndFee?: boolean
} => {
  const auth = useAuth()
  const query = useQuery(() => ({
    queryKey: queryKeys.profile.avatars(getAuthQueryScope(auth.authToken)),
    queryFn: ({ signal }) =>
      fetchApiQuery<ProfileAvatarsRes>(GET_PROFILE_AVATARS_AND_COST_API, {
        signal,
        init: { headers: { authorizationToken: auth.authToken || '' } },
      }),
    enabled: !!auth.authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))
  return {
    get errorAvatarsAndFee() {
      return (query.error as Error | undefined) ?? undefined
    },
    get avatarsAndFee() {
      return query.data
    },
    get loadingAvatarsAndFee() {
      return query.isLoading
    },
  }
}

export default useProfileAvatarFee
