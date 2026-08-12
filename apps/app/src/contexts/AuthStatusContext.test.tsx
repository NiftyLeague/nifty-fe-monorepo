import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { PropsWithChildren } from 'react'

import { AuthStatusProvider, useAuthStatus } from './AuthStatusContext'

const wrapper = ({ children }: PropsWithChildren) => (
  <AuthStatusProvider>{children}</AuthStatusProvider>
)

describe('AuthStatusContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shares and persists the authenticated state', () => {
    const { result } = renderHook(() => useAuthStatus(), { wrapper })

    expect(result.current.isLoggedIn).toBe(false)
    act(() => result.current.setIsLoggedIn(true))

    expect(result.current.isLoggedIn).toBe(true)
    expect(window.localStorage.getItem('nifty-auth-status')).toBe('true')
  })

  it('migrates the persisted account flag from the removed store', () => {
    window.localStorage.setItem('persist', JSON.stringify({ account: { isLoggedIn: true } }))

    const { result } = renderHook(() => useAuthStatus(), { wrapper })

    expect(result.current.isLoggedIn).toBe(true)
  })

  it('fails clearly when consumed outside its provider', () => {
    expect(() => renderHook(() => useAuthStatus())).toThrow(
      'useAuthStatus must be used inside AuthStatusProvider'
    )
  })
})
