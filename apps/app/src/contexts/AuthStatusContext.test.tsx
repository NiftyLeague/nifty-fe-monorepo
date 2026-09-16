import { act, renderHook } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it } from 'bun:test'

import { readInitialAuthStatus } from '@/state/auth-store'
import { useAuthStatus } from './AuthStatusContext'

describe('useAuthStatus', () => {
  beforeEach(() => {
    window.localStorage.clear()
    // Reset the module singleton so tests start from a logged-out state.
    act(() => useAuthStatus().setIsLoggedIn(false))
  })

  it('shares and persists the authenticated state across consumers', () => {
    const first = renderHook(() => useAuthStatus())
    const second = renderHook(() => useAuthStatus())

    expect(first.result.current.isLoggedIn).toBe(false)

    act(() => first.result.current.setIsLoggedIn(true))

    expect(second.result.current.isLoggedIn).toBe(true)
    expect(window.localStorage.getItem('nifty-auth-status')).toBe('true')
  })

  it('migrates the persisted account flag from the removed store', () => {
    // The singleton's persistence effect rewrites the current key on reset,
    // so drop it to simulate a pre-key storage state.
    window.localStorage.removeItem('nifty-auth-status')
    window.localStorage.setItem('persist', JSON.stringify({ account: { isLoggedIn: true } }))

    expect(readInitialAuthStatus()).toBe(true)
  })

  it('prefers the current flag over the legacy migration key', () => {
    window.localStorage.setItem('nifty-auth-status', 'false')
    window.localStorage.setItem('persist', JSON.stringify({ account: { isLoggedIn: true } }))

    expect(readInitialAuthStatus()).toBe(false)
  })
})
