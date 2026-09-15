'use client'

import { createContext, useContext, createEffect, createSignal, type JSX } from 'solid-js'

import { safeJSONParse } from '@/utils/json'

export type AuthStatusContextValue = {
  readonly isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

const AUTH_STATUS_KEY = 'nifty-auth-status'
const AuthStatusContext = createContext<AuthStatusContextValue | null>(null)

const readInitialStatus = (): boolean => {
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

export function AuthStatusProvider(props: { children?: JSX.Element }) {
  const [isLoggedIn, setIsLoggedIn] = createSignal(readInitialStatus())

  createEffect(() => {
    window.localStorage.setItem(AUTH_STATUS_KEY, JSON.stringify(isLoggedIn()))
  })

  const value: AuthStatusContextValue = {
    get isLoggedIn() {
      return isLoggedIn()
    },
    setIsLoggedIn,
  }

  return <AuthStatusContext.Provider value={value}>{props.children}</AuthStatusContext.Provider>
}

export function useAuthStatus() {
  const context = useContext(AuthStatusContext)

  if (!context) throw new Error('useAuthStatus must be used inside AuthStatusProvider')

  return context
}
