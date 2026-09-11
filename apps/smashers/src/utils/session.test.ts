import { afterEach, describe, expect, it } from 'bun:test'

import { SESSION_TIMEOUT, getSessionOptions, json } from './session'

const SECRET = 'a-secure-test-secret-that-is-at-least-32-characters'

const originalEnv = { ...process.env }

const stubEnv = (key: string, value: string | undefined) => {
  if (value === undefined) delete process.env[key]
  else process.env[key] = value
}

afterEach(() => {
  process.env = { ...originalEnv }
})

describe('session configuration', () => {
  it('uses secure, HTTP-only cookies with explicit timeouts', () => {
    stubEnv('NEXTAUTH_SECRET', SECRET)
    stubEnv('SESSION_SECRET', undefined)

    expect(SESSION_TIMEOUT.remember).toBeGreaterThan(SESSION_TIMEOUT.default)

    const options = getSessionOptions()
    expect(options.cookieName).toBe('iron_session_playfab')
    expect(options.cookieOptions).toMatchObject({ httpOnly: true, sameSite: 'lax' })
    expect(options.cookieOptions?.maxAge).toBe(SESSION_TIMEOUT.remember)
  })

  it('prefers the renamed secret and still accepts the legacy name', () => {
    stubEnv('SESSION_SECRET', SECRET)
    stubEnv('NEXTAUTH_SECRET', undefined)
    expect(getSessionOptions().password).toBe(SECRET)

    stubEnv('SESSION_SECRET', undefined)
    stubEnv('NEXTAUTH_SECRET', SECRET)
    expect(getSessionOptions().password).toBe(SECRET)
  })

  it('refuses to build session options without a long enough secret', () => {
    stubEnv('SESSION_SECRET', 'too-short')
    stubEnv('NEXTAUTH_SECRET', undefined)
    expect(() => getSessionOptions()).toThrow(/SESSION_SECRET/)

    stubEnv('SESSION_SECRET', undefined)
    expect(() => getSessionOptions()).toThrow(/SESSION_SECRET/)
  })

  it('marks the cookie secure on deployed environments only', () => {
    stubEnv('SESSION_SECRET', SECRET)

    stubEnv('PUBLIC_DEPLOY_ENV', 'production')
    expect(getSessionOptions().cookieOptions?.secure).toBe(true)

    stubEnv('PUBLIC_DEPLOY_ENV', 'development')
    stubEnv('VERCEL_ENV', 'preview')
    expect(getSessionOptions().cookieOptions?.secure).toBe(true)

    stubEnv('VERCEL_ENV', undefined)
    expect(getSessionOptions().cookieOptions?.secure).toBe(false)
  })
})

describe('json response helper', () => {
  it('serializes the body with a JSON content type', async () => {
    const response = json({ ok: true })
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
    await expect(response.json()).resolves.toEqual({ ok: true })
  })

  it('carries the status and merged headers through', async () => {
    const response = json({ message: 'nope' }, { status: 401, headers: { 'X-Test': '1' } })
    expect(response.status).toBe(401)
    expect(response.headers.get('X-Test')).toBe('1')
    expect(response.headers.get('content-type')).toContain('application/json')
    await expect(response.json()).resolves.toEqual({ message: 'nope' })
  })
})
