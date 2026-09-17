import { beforeEach, describe, expect, it } from 'bun:test'

import { buildAuthCookie, clearAllAuth, readAuthCookieToken, setAuthToken } from './auth-storage'

describe('auth token cookie mirror', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('builds a session cookie with the encoded token', () => {
    const cookie = buildAuthCookie('token-a', 'https:')

    expect(cookie).toContain('nl-auth-token=token-a')
    expect(cookie).toContain('samesite=lax')
    expect(cookie).toContain('secure')
    expect(readAuthCookieToken(cookie)).toBe('token-a')
  })

  it('expires the cookie when the token is cleared', () => {
    const cookie = buildAuthCookie(undefined, 'http:')

    expect(cookie).toContain('nl-auth-token=')
    expect(cookie).toContain('max-age=0')
    expect(cookie).not.toContain('secure')
    expect(readAuthCookieToken(cookie)).toBe('')
  })

  it('resolves functional updates against the previous token', () => {
    setAuthToken('token-a')
    setAuthToken((prev) => `${prev}-b`)

    expect(readAuthCookieToken(buildAuthCookie('token-a-b', 'http:'))).toBe('token-a-b')
    clearAllAuth()
  })

  it('parses the token from a raw Cookie header', () => {
    expect(readAuthCookieToken('other=1; nl-auth-token=abc%2Bdef; more=2')).toBe('abc+def')
    expect(readAuthCookieToken('other=1')).toBeUndefined()
    expect(readAuthCookieToken(null)).toBeUndefined()
  })
})
