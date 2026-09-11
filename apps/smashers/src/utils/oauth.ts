import type { APIContext } from 'astro'

import {
  buildAuthorizeUrl,
  createPkcePair,
  createState,
  getOAuthCredentials,
  getOAuthProvider,
  type OAuthProviderConfig,
} from '@nl/playfab/auth/oauth'
import { OAUTH_FLOW_COOKIE, OAUTH_FLOW_TTL_SECONDS, sealFlowState } from '@nl/playfab/auth/flow'

export const OAUTH_SECRET_ENV = ['SESSION_SECRET', 'NEXTAUTH_SECRET'] as const
/** The single secret used for both the iron-session cookie and the flow seal. */
export const getAuthSecret = (): string => {
  const secret = OAUTH_SECRET_ENV.map((name) => process.env[name]).find(Boolean)
  if (!secret || secret.length < 32) {
    throw new Error('Missing or invalid SESSION_SECRET (needs 32+ chars)')
  }
  return secret
}

export const getCallbackUrl = (context: APIContext, provider: string): string =>
  new URL(`/api/auth/callback/${provider}`, context.url.origin).toString()

/** Only same-origin paths may be used as a post-login destination. */
export const resolveCallbackUrl = (raw: string | null, fallback = '/profile'): string => {
  if (!raw) return fallback
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback
  return raw
}

export interface StartedFlow {
  redirect: string
}

/**
 * Starts an authorization-code flow: resolves the provider config, mints the
 * state/PKCE pair, stores the sealed flow in a cookie and returns the provider
 * authorization URL to redirect to.
 */
export async function startOAuthFlow(
  context: APIContext,
  provider: string,
  callbackUrl: string
): Promise<StartedFlow | { error: string }> {
  const config: OAuthProviderConfig | undefined = getOAuthProvider(provider)
  if (!config) return { error: `Unknown provider: ${provider}` }

  const credentials = getOAuthCredentials(config)
  if (!credentials) return { error: `Provider ${provider} is not configured` }

  const state = createState()
  const pkce = config.pkce ? await createPkcePair() : undefined
  const redirectUri = getCallbackUrl(context, config.id)

  const seal = await sealFlowState(
    { provider: config.id, state, verifier: pkce?.verifier, callbackUrl },
    getAuthSecret()
  )

  context.cookies.set(OAUTH_FLOW_COOKIE, seal, {
    httpOnly: true,
    // Apple returns its callback as a cross-site form POST, so the flow cookie
    // has to survive that hop; `lax` would drop it on POST.
    sameSite: config.formPost ? 'none' : 'lax',
    secure: import.meta.env.PROD || context.url.protocol === 'https:',
    path: '/',
    maxAge: OAUTH_FLOW_TTL_SECONDS,
  })

  return {
    redirect: buildAuthorizeUrl({
      config,
      clientId: credentials.clientId,
      redirectUri,
      state,
      challenge: pkce?.challenge,
    }),
  }
}

/** Clears the flow cookie once the callback has consumed it. */
export const clearFlowCookie = (context: APIContext): void => {
  context.cookies.delete(OAUTH_FLOW_COOKIE, { path: '/' })
}

export { getSession, json } from './session'
