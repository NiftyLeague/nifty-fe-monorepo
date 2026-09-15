import { createResource, type Resource } from 'solid-js'

import type { User, UserInfo } from '../types'
import { USER_INFO_INITIAL_STATE } from '../constants'
import fetchJson from '../utils/fetchJson'

export function useUserInfo(user: Resource<User | undefined> | (() => User | undefined)) {
  // We do a request to /api/playfab/user/info only if the user is logged in
  const [userInfo, { mutate, refetch }] = createResource<UserInfo | undefined, boolean>(
    () => Boolean(user()?.isLoggedIn),
    async (loggedIn) => {
      if (!loggedIn) return USER_INFO_INITIAL_STATE as UserInfo
      return fetchJson<UserInfo>('/api/playfab/user/info')
    },
    { initialValue: undefined }
  )

  return {
    userInfo,
    mutateUserInfo: (next?: UserInfo) => mutate(() => next),
    refetchUserInfo: () => refetch(),
  }
}

export default useUserInfo
