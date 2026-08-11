import { describe, expect, it } from 'bun:test'
import { authOptions } from './auth'

describe('playfab auth callbacks', () => {
  const { jwt, session, signIn } = authOptions.callbacks

  it('jwt enriches token when account is present', async () => {
    const token = { name: 'x', sub: '1' }
    const account = { access_token: 'abc', provider: 'google' }

    const result = await jwt({ token, account, trigger: 'signIn' })

    expect(result).toEqual({ name: 'x', sub: '1', accessToken: 'abc', provider: 'google' })
  })

  it('jwt returns token unchanged when account is absent', async () => {
    const token = { name: 'x', sub: '1' }

    const result = await jwt({ token, account: undefined })

    expect(result).toEqual({ name: 'x', sub: '1' })
  })

  it('session copies accessToken and provider from token to session', async () => {
    const currentSession = { user: { name: 'x', email: 't@e.com' } }
    const token = { accessToken: 'abc', provider: 'google' }

    const result = await session({ session: currentSession, token })

    expect(result).toEqual({
      user: { name: 'x', email: 't@e.com' },
      accessToken: 'abc',
      provider: 'google',
    })
  })

  it('signIn always allows sign-in', async () => {
    const result = await signIn({})

    expect(result).toBe(true)
  })
})
