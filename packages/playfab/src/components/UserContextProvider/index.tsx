import {
  createContext,
  createEffect,
  type Accessor,
  type ParentComponent,
  type Resource,
} from 'solid-js'

import { fetchJson, FetchError } from '../../utils/fetchJson'
import { useUserInfo } from '../../hooks/useUserInfo'
import { useUserSession } from '../../hooks/useUserSession'
import type { UserInfo, User } from '../../types'

/**
 * Solid context value: everything is an accessor so consumers stay reactive.
 * `UserContextType` (the React-era plain shape) is derived from this in
 * `useUserContext` for call sites that want a snapshot.
 */
export interface UserContextValue {
  isLoggedIn: Accessor<boolean>
  user: Resource<User | undefined>
  userInfo: Resource<UserInfo | undefined>
  refetchPlayer: () => Promise<UserInfo | undefined>
}

export const UserContext = createContext<UserContextValue>()

/**
 * The auth surface is a plain document, so `?game-token=` is read from the
 * location instead of a framework router hook. It stays reactive so the shared
 * context keeps the same contract for both launch paths.
 */
const readGameToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('game-token')
}

export const UserContextProvider: ParentComponent = (props) => {
  const gameToken = readGameToken()
  const { user, mutateUser } = useUserSession()
  const { userInfo, mutateUserInfo } = useUserInfo(user)
  const isLoggedIn = () => Boolean(user()?.isLoggedIn)

  const handleAnonLogin = async (CustomId: string) => {
    // Login player with stored CustomID
    try {
      const res = await fetchJson<User>('/api/playfab/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ CustomId }),
      })
      mutateUser(res)
    } catch (error) {
      // Cleanup & force logout so we can verify Custom ID
      const status = (error as FetchError).response?.status
      switch (status) {
        case 400: // AccountDeleted
        case 404: // AccountNotFound
          mutateUser(await fetchJson('/api/playfab/logout', { method: 'POST' }))
          break
        default:
          break
      }
    }
  }

  createEffect(() => {
    if (gameToken) {
      void handleAnonLogin(gameToken)
    } else if (!isLoggedIn() && user()?.CustomId && user()?.persistLogin) {
      void handleAnonLogin(user()!.CustomId as string)
    }
  })

  const value: UserContextValue = {
    isLoggedIn,
    user,
    userInfo,
    refetchPlayer: async () => {
      await mutateUserInfo()
      return userInfo()
    },
  }

  return <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
}

export default UserContextProvider
