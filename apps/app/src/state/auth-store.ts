import { createEffect, createSignal } from 'solid-js'

import { safeJSONParse } from '@/utils/json'

const AUTH_STATUS_KEY = 'nifty-auth-status'

/**
 * The logged-in flag is app-global state. Nested provider stacks (the private
 * shell, the leaderboard rank boundary, the wallet-auth boundaries) previously
 * each owned their own context signal mirroring this key, so a logout in one
 * subtree left the others stale. A module singleton gives every reader and
 * writer the same fine-grained signal; persistence happens in exactly one
 * place.
 */
export const readInitialAuthStatus = (): boolean => {
  if (typeof window === 'undefined') return false

  try {
    const current = safeJSONParse(window.localStorage.getItem(AUTH_STATUS_KEY))
    if (typeof current === 'boolean') return current

    const legacy = safeJSONParse(window.localStorage.getItem('persist')) as {
      account?: { isLoggedIn?: unknown }
    } | null
    return legacy?.account?.isLoggedIn === true
  } catch {
    return false
  }
}

const [isLoggedIn, setIsLoggedIn] = createSignal(readInitialAuthStatus())

if (typeof window !== 'undefined') {
  createEffect(() => {
    window.localStorage.setItem(AUTH_STATUS_KEY, JSON.stringify(isLoggedIn()))
  })
}

export { isLoggedIn, setIsLoggedIn }
