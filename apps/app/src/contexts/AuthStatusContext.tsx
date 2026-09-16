import {
  isLoggedIn as authIsLoggedIn,
  setIsLoggedIn as setAuthIsLoggedIn,
} from '@/state/auth-store'

export type AuthStatusContextValue = {
  readonly isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

const AUTH_STATUS: AuthStatusContextValue = {
  get isLoggedIn() {
    return authIsLoggedIn()
  },
  setIsLoggedIn: setAuthIsLoggedIn,
}

/**
 * The logged-in flag lives in the module singleton (`@/state/auth-store`), so
 * every consumer — regardless of which provider stack it renders under —
 * reads and writes one source of truth. No provider is required anymore.
 */
export function useAuthStatus(): AuthStatusContextValue {
  return AUTH_STATUS
}
