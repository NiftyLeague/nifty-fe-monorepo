import { describe, expect, it } from 'bun:test'

import {
  buildAuthorizeUrl,
  createPkcePair,
  createState,
  exchangeCodeForTokens,
  getLinkCredential,
  getOAuthCredentials,
  getOAuthProvider,
  getSignInPath,
  isOAuthProvider,
  OAUTH_PROVIDERS,
} from './oauth'

describe('oauth provider registry', () => {
  it('keeps the four providers the PlayFab link endpoints support', () => {
    expect([...OAUTH_PROVIDERS]).toEqual(['google', 'apple', 'facebook', 'twitch'])
    expect(isOAuthProvider('google')).toBe(true)
    expect(isOAuthProvider('discord')).toBe(false)
    expect(getOAuthProvider('discord')).toBeUndefined()
  })

  it('links Apple with its OIDC identity token and the rest with the access token', () => {
    const tokens = { accessToken: 'access', idToken: 'identity' }

    expect(getLinkCredential(getOAuthProvider('google')!, tokens)).toBe('access')
    expect(getLinkCredential(getOAuthProvider('facebook')!, tokens)).toBe('access')
    expect(getLinkCredential(getOAuthProvider('twitch')!, tokens)).toBe('access')
    expect(getLinkCredential(getOAuthProvider('apple')!, tokens)).toBe('identity')
  })

  it('falls back to the access token when Apple omits an identity token', () => {
    const apple = getOAuthProvider('apple')!
    expect(getLinkCredential(apple, { accessToken: 'access' })).toBe('access')
    expect(getLinkCredential(apple, {})).toBeUndefined()
  })

  it('reads credentials from the provider-specific environment variables', () => {
    const google = getOAuthProvider('google')!
    const env = { GOOGLE_CLIENT_ID: 'id', GOOGLE_CLIENT_SECRET: 'secret' }

    expect(getOAuthCredentials(google, env)).toEqual({ clientId: 'id', clientSecret: 'secret' })
    expect(getOAuthCredentials(google, { GOOGLE_CLIENT_ID: 'id' })).toBeUndefined()
    expect(getOAuthCredentials(google, {})).toBeUndefined()
  })
})

describe('authorization url', () => {
  it('carries state, redirect and PKCE challenge for confidential clients', () => {
    const url = new URL(
      buildAuthorizeUrl({
        config: getOAuthProvider('google')!,
        clientId: 'client',
        redirectUri: 'https://niftysmashers.com/api/auth/callback/google',
        state: 'state-value',
        challenge: 'challenge-value',
      })
    )

    expect(url.origin + url.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth')
    expect(url.searchParams.get('client_id')).toBe('client')
    expect(url.searchParams.get('response_type')).toBe('code')
    expect(url.searchParams.get('redirect_uri')).toBe(
      'https://niftysmashers.com/api/auth/callback/google'
    )
    expect(url.searchParams.get('state')).toBe('state-value')
    expect(url.searchParams.get('code_challenge')).toBe('challenge-value')
    expect(url.searchParams.get('code_challenge_method')).toBe('S256')
    expect(url.searchParams.get('scope')).toBe('openid email profile')
  })

  it('requests form_post for Apple, whose callback arrives as a cross-site POST', () => {
    const url = new URL(
      buildAuthorizeUrl({
        config: getOAuthProvider('apple')!,
        clientId: 'client',
        redirectUri: 'https://niftysmashers.com/api/auth/callback/apple',
        state: 'state-value',
      })
    )

    expect(url.searchParams.get('response_mode')).toBe('form_post')
  })

  it('omits the PKCE challenge for providers without PKCE support', () => {
    const url = new URL(
      buildAuthorizeUrl({
        config: getOAuthProvider('facebook')!,
        clientId: 'client',
        redirectUri: 'https://niftysmashers.com/api/auth/callback/facebook',
        state: 'state-value',
      })
    )

    expect(url.searchParams.get('code_challenge')).toBeNull()
  })

  it('builds the browser entry point with an encoded callback', () => {
    expect(getSignInPath('google')).toBe('/api/auth/signin/google?callbackUrl=%2Fprofile')
    expect(getSignInPath('google', '/profile#li-google')).toBe(
      '/api/auth/signin/google?callbackUrl=%2Fprofile%23li-google'
    )
  })
})

describe('pkce and state generation', () => {
  it('produces a url-safe state value', () => {
    const state = createState()
    expect(state).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(state.length).toBeGreaterThanOrEqual(32)
    expect(createState()).not.toBe(state)
  })

  it('derives an S256 challenge from the verifier', async () => {
    const { verifier, challenge } = await createPkcePair()

    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(challenge).not.toBe(verifier)

    // Independent recomputation of the documented transform.
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
    const expected = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    expect(challenge).toBe(expected)
  })
})

describe('code exchange', () => {
  const config = getOAuthProvider('google')!

  it('returns the token set on success', async () => {
    const originalFetch = globalThis.fetch
    let requestBody: URLSearchParams | undefined
    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      requestBody = new URLSearchParams(String(init?.body))
      return new Response(
        JSON.stringify({ access_token: 'access', id_token: 'identity', expires_in: 3600 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }) as typeof fetch

    try {
      const tokens = await exchangeCodeForTokens({
        config,
        clientId: 'client',
        clientSecret: 'secret',
        code: 'auth-code',
        redirectUri: 'https://niftysmashers.com/api/auth/callback/google',
        verifier: 'verifier-value',
      })

      expect(tokens).toEqual({
        accessToken: 'access',
        idToken: 'identity',
        tokenType: undefined,
        scope: undefined,
        expiresIn: 3600,
      })
      expect(requestBody?.get('grant_type')).toBe('authorization_code')
      expect(requestBody?.get('code')).toBe('auth-code')
      expect(requestBody?.get('code_verifier')).toBe('verifier-value')
      expect(requestBody?.get('client_secret')).toBe('secret')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('throws the provider error description when the exchange fails', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ error: 'invalid_grant', error_description: 'expired code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch

    try {
      await expect(
        exchangeCodeForTokens({
          config,
          clientId: 'client',
          clientSecret: 'secret',
          code: 'auth-code',
          redirectUri: 'https://niftysmashers.com/api/auth/callback/google',
        })
      ).rejects.toThrow('expired code')
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
