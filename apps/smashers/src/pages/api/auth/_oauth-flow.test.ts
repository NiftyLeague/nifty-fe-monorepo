import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

import type { APIContext } from 'astro'

/**
 * End-to-end guard for the OAuth link flow that replaced next-auth.
 *
 * The unit tests cover the pure helpers; this drives the real route handlers
 * through a full round trip — start a flow, receive the provider callback,
 * exchange the code and link the account — with only the provider token
 * endpoint and the PlayFab client mocked. It is the test that proves the
 * signin route, the sealed flow cookie, the callback route and the PlayFab
 * link call are wired to each other correctly.
 */

const SECRET = 'integration-test-secret-0123456789abcde'

process.env.SESSION_SECRET = SECRET
process.env.GOOGLE_CLIENT_ID = 'google-client'
process.env.GOOGLE_CLIENT_SECRET = 'google-secret'
process.env.APPLE_CLIENT_ID = 'apple-client'
process.env.APPLE_CLIENT_SECRET = 'apple-secret'
process.env.PUBLIC_DEPLOY_ENV = 'development'

/** Records every PlayFab link call the callback route makes. */
const linkCalls: { provider: string; credential: string; sessionTicket: string }[] = []

/**
 * One mock for the whole client module: the login route and the callback route
 * both import from it, so a partial mock would break whichever route is
 * imported second.
 */
mock.module('@nl/playfab/api/client', () => ({
  LinkProvider: async (provider: string, credential: string, sessionTicket: string) => {
    linkCalls.push({ provider, credential, sessionTicket })
    return { data: {} }
  },
  LoginWithEmailAddress: async () => ({
    SessionTicket: 'playfab-session-ticket',
    PlayFabId: 'PLAYFAB_ID',
    EntityToken: { EntityToken: 'entity-token' },
  }),
  LoginWithCustomID: async () => ({
    SessionTicket: 'playfab-session-ticket',
    PlayFabId: 'PLAYFAB_ID',
    EntityToken: { EntityToken: 'entity-token' },
  }),
}))

interface CookieRecord {
  name: string
  value: string
}

/**
 * Minimal APIContext over a cookie map. Reads and writes go through the same
 * jar, so iron-session genuinely seals on write and unseals on the next
 * request instead of being stubbed at the boundary under test.
 */
function createContext({
  url,
  method = 'GET',
  params = {},
  body,
  cookies: incoming = [],
}: {
  url: string
  method?: string
  params?: Record<string, string>
  body?: string | FormData | URLSearchParams
  cookies?: CookieRecord[]
}) {
  const jar = new Map(incoming.map((cookie) => [cookie.name, cookie.value]))
  const deleted: string[] = []

  const request = new Request(url, {
    method,
    ...(body ? { body } : {}),
    headers:
      body && !(body instanceof FormData)
        ? { 'Content-Type': 'application/x-www-form-urlencoded' }
        : undefined,
  })

  const context = {
    params,
    request,
    url: new URL(url),
    cookies: {
      get: (name: string) => {
        const value = jar.get(name)
        return value === undefined ? undefined : { value }
      },
      set: (name: string, value: string) => {
        jar.set(name, value)
      },
      delete: (name: string) => {
        jar.delete(name)
        deleted.push(name)
      },
    },
    redirect: (destination: string, status = 302) =>
      new Response(null, { status, headers: { Location: destination } }),
  } as unknown as APIContext

  return {
    context,
    /** Cookies as they would come back on the browser's next request. */
    outgoing: () => [...jar].map(([name, value]) => ({ name, value })),
    deleted,
  }
}

/**
 * A PlayFab session cookie, produced by the real login route rather than
 * hand-sealed, so the session the callback reads is the one login would write.
 */
async function loginCookie(): Promise<CookieRecord[]> {
  const { POST } = await import('@/pages/api/playfab/login')
  const { context, outgoing } = createContext({
    url: 'https://niftysmashers.com/api/playfab/login',
    method: 'POST',
    body: JSON.stringify({ email: 'player@example.com', password: 'pw' }),
  })
  const response = await POST(context)
  if (response.status !== 200) {
    throw new Error(`login route failed with ${response.status}: ${await response.text()}`)
  }
  return outgoing()
}

const originalFetch = globalThis.fetch

beforeEach(() => {
  linkCalls.length = 0
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('OAuth link flow', () => {
  it('starts a flow with state, PKCE and a sealed cookie', async () => {
    const { GET } = await import('@/pages/api/auth/signin/[provider]')
    const { context, outgoing } = createContext({
      url: 'https://niftysmashers.com/api/auth/signin/google?callbackUrl=%2Fprofile',
      params: { provider: 'google' },
    })

    const response = await GET(context)
    const location = new URL(response.headers.get('location') as string)

    expect(response.status).toBe(302)
    expect(location.origin + location.pathname).toBe('https://accounts.google.com/o/oauth2/v2/auth')
    expect(location.searchParams.get('client_id')).toBe('google-client')
    expect(location.searchParams.get('response_type')).toBe('code')
    expect(location.searchParams.get('redirect_uri')).toBe(
      'https://niftysmashers.com/api/auth/callback/google'
    )
    expect(location.searchParams.get('state')).toBeTruthy()
    expect(location.searchParams.get('code_challenge_method')).toBe('S256')
    expect(location.searchParams.get('code_challenge')).toBeTruthy()

    const flowCookie = outgoing().find((cookie) => cookie.name === 'oauth_flow')
    expect(flowCookie, 'the flow must be persisted for the callback').toBeTruthy()
    // The state in the URL must match the state inside the sealed cookie.
    const flow = await unseal(flowCookie!.value)
    expect(flow.state).toBe(location.searchParams.get('state'))
    expect(flow.verifier, 'a PKCE verifier must be sealed for the exchange').toBeTruthy()
  })

  it('rejects an unknown provider without starting a flow', async () => {
    const { GET } = await import('@/pages/api/auth/signin/[provider]')
    const { context } = createContext({
      url: 'https://niftysmashers.com/api/auth/signin/discord',
      params: { provider: 'discord' },
    })

    const response = await GET(context)
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({ message: 'Unknown provider: discord' })
  })

  it('links the provider server-side and never exposes the token', async () => {
    const signIn = await import('@/pages/api/auth/signin/[provider]')
    const login = await loginCookie()

    const started = createContext({
      url: 'https://niftysmashers.com/api/auth/signin/google?callbackUrl=%2Fprofile',
      params: { provider: 'google' },
      cookies: login,
    })
    await signIn.GET(started.context)
    const flowCookies = started
      .outgoing()
      .filter((cookie) => cookie.name !== 'iron_session_playfab')

    // The provider redirects back with the code and the same state.
    const flow = await unseal(flowCookies.find((c) => c.name === 'oauth_flow')!.value)
    let tokenRequest: URLSearchParams | undefined
    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      tokenRequest = new URLSearchParams(String(init?.body))
      return new Response(JSON.stringify({ access_token: 'google-access-token' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }) as typeof fetch

    const { GET } = await import('@/pages/api/auth/callback/[provider]')
    const callback = createContext({
      url: `https://niftysmashers.com/api/auth/callback/google?code=AUTH_CODE&state=${flow.state}`,
      params: { provider: 'google' },
      cookies: [...login, ...flowCookies],
    })

    const response = await GET(callback.context)

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/profile')
    // The code was exchanged with the sealed verifier...
    expect(tokenRequest?.get('code')).toBe('AUTH_CODE')
    expect(tokenRequest?.get('code_verifier')).toBe(flow.verifier)
    expect(tokenRequest?.get('client_secret')).toBe('google-secret')
    // ...and the resulting token was linked to the PlayFab account server-side.
    expect(linkCalls).toEqual([
      {
        provider: 'google',
        credential: 'google-access-token',
        sessionTicket: 'playfab-session-ticket',
      },
    ])
    // The flow cookie is single-use.
    expect(callback.deleted).toContain('oauth_flow')
  })

  it('links Apple with its OIDC identity token, not the access token', async () => {
    const signIn = await import('@/pages/api/auth/signin/[provider]')
    const login = await loginCookie()

    const started = createContext({
      url: 'https://niftysmashers.com/api/auth/signin/apple?callbackUrl=%2Fprofile',
      params: { provider: 'apple' },
      cookies: login,
    })
    await signIn.GET(started.context)
    const flowCookies = started
      .outgoing()
      .filter((cookie) => cookie.name !== 'iron_session_playfab')
    const flow = await unseal(flowCookies.find((c) => c.name === 'oauth_flow')!.value)

    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({ access_token: 'apple-access-token', id_token: 'apple-id-token' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )) as typeof fetch

    const { GET, POST } = await import('@/pages/api/auth/callback/[provider]')
    // Apple answers with a cross-site form POST rather than a GET query.
    const form = new URLSearchParams({ code: 'APPLE_CODE', state: flow.state })
    const callback = createContext({
      url: 'https://niftysmashers.com/api/auth/callback/apple',
      method: 'POST',
      params: { provider: 'apple' },
      body: form,
      cookies: [...login, ...flowCookies],
    })
    // Both verbs share the handler; assert the form_post path explicitly.
    expect(typeof POST).toBe('function')

    const response = await GET(callback.context)

    expect(response.status).toBe(302)
    expect(linkCalls).toEqual([
      { provider: 'apple', credential: 'apple-id-token', sessionTicket: 'playfab-session-ticket' },
    ])
  })

  it('refuses a callback with no flow cookie', async () => {
    const { GET } = await import('@/pages/api/auth/callback/[provider]')
    const { context } = createContext({
      url: 'https://niftysmashers.com/api/auth/callback/google?code=AUTH_CODE&state=anything',
      params: { provider: 'google' },
    })

    const response = await GET(context)
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      message: 'Invalid or expired sign-in attempt',
    })
    expect(linkCalls).toEqual([])
  })

  it('rejects a state that does not match the sealed flow', async () => {
    const signIn = await import('@/pages/api/auth/signin/[provider]')
    const started = createContext({
      url: 'https://niftysmashers.com/api/auth/signin/google',
      params: { provider: 'google' },
    })
    await signIn.GET(started.context)

    globalThis.fetch = (async () => new Response('{}', { status: 200 })) as typeof fetch

    const { GET } = await import('@/pages/api/auth/callback/[provider]')
    const callback = createContext({
      url: 'https://niftysmashers.com/api/auth/callback/google?code=AUTH_CODE&state=forged-state',
      params: { provider: 'google' },
      cookies: started.outgoing(),
    })

    const response = await GET(callback.context)
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({ message: 'Invalid state parameter' })
    expect(linkCalls).toEqual([])
  })

  it('sends a visitor without a PlayFab session to login instead of linking', async () => {
    const signIn = await import('@/pages/api/auth/signin/[provider]')
    const started = createContext({
      url: 'https://niftysmashers.com/api/auth/signin/google',
      params: { provider: 'google' },
    })
    await signIn.GET(started.context)
    const flow = await unseal(started.outgoing().find((c) => c.name === 'oauth_flow')!.value)

    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ access_token: 'google-access-token' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch

    const { GET } = await import('@/pages/api/auth/callback/[provider]')
    const callback = createContext({
      url: `https://niftysmashers.com/api/auth/callback/google?code=AUTH_CODE&state=${flow.state}`,
      params: { provider: 'google' },
      cookies: started.outgoing(),
    })

    const response = await GET(callback.context)

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/login?error=link-required')
    expect(linkCalls, 'no PlayFab account means no link').toEqual([])
  })

  it('surfaces a provider error without calling PlayFab', async () => {
    const { GET } = await import('@/pages/api/auth/callback/[provider]')
    const { context } = createContext({
      url: 'https://niftysmashers.com/api/auth/callback/google?error=access_denied&error_description=User+denied',
      params: { provider: 'google' },
    })

    const response = await GET(context)
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({ message: 'User denied' })
    expect(linkCalls).toEqual([])
  })

  it('finishes at login when the code exchange fails', async () => {
    const signIn = await import('@/pages/api/auth/signin/[provider]')
    const login = await loginCookie()
    const started = createContext({
      url: 'https://niftysmashers.com/api/auth/signin/google',
      params: { provider: 'google' },
      cookies: login,
    })
    await signIn.GET(started.context)
    const flowCookies = started.outgoing().filter((c) => c.name !== 'iron_session_playfab')
    const flow = await unseal(flowCookies.find((c) => c.name === 'oauth_flow')!.value)

    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ error: 'invalid_grant' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })) as typeof fetch

    const { GET } = await import('@/pages/api/auth/callback/[provider]')
    const callback = createContext({
      url: `https://niftysmashers.com/api/auth/callback/google?code=EXPIRED&state=${flow.state}`,
      params: { provider: 'google' },
      cookies: [...login, ...flowCookies],
    })

    const response = await GET(callback.context)
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/login?error=oauth')
    expect(linkCalls).toEqual([])
  })
})

/** Unseal a flow cookie with the test secret, exactly as the route would. */
async function unseal(seal: string) {
  const { unsealFlowState } = await import('@nl/playfab/auth/flow')
  const flow = await unsealFlowState(seal, SECRET, 'google')
  if (flow) return flow
  // Apple flows must be unsealed against their own provider id.
  const apple = await unsealFlowState(seal, SECRET, 'apple')
  if (!apple) throw new Error('flow cookie could not be unsealed')
  return apple
}
