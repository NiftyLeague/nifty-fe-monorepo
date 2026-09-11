/**
 * Provider-side OAuth 2.0 / OIDC authorization-code helpers.
 *
 * This replaces the next-auth v4 server integration that used to live in
 * `../utils/auth.ts`. The provider set, scopes and redirect URIs are unchanged
 * so the client IDs already registered with each provider keep working; only
 * the implementation is local now.
 *
 * Server-only: reads client secrets from the environment. Never import this
 * module from a component that ships to the browser.
 */

export const OAUTH_PROVIDERS = ['google', 'apple', 'facebook', 'twitch'] as const

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number]

export interface OAuthProviderConfig {
  id: OAuthProvider
  authorizeUrl: string
  tokenUrl: string
  scope: string
  clientIdEnv: string
  clientSecretEnv: string
  /**
   * PKCE support. Apple and Google accept it; Twitch accepts it for public
   * clients; Facebook's dialog ignores `code_challenge`, so it stays off there.
   */
  pkce: boolean
  /**
   * Apple posts the authorization response back with `response_mode=form_post`,
   * which is why the flow cookie has to survive a cross-site POST.
   */
  formPost: boolean
  /**
   * Providers that authenticate the PlayFab link call with an OIDC ID token
   * instead of an OAuth access token.
   */
  credential: 'access_token' | 'id_token'
}

const CONFIGS: Record<OAuthProvider, OAuthProviderConfig> = {
  google: {
    id: 'google',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'openid email profile',
    clientIdEnv: 'GOOGLE_CLIENT_ID',
    clientSecretEnv: 'GOOGLE_CLIENT_SECRET',
    pkce: true,
    formPost: false,
    credential: 'access_token',
  },
  apple: {
    id: 'apple',
    authorizeUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    scope: 'name email',
    clientIdEnv: 'APPLE_CLIENT_ID',
    // Apple's client secret is a pre-generated ES256 JWT, not a static string.
    clientSecretEnv: 'APPLE_CLIENT_SECRET',
    pkce: true,
    formPost: true,
    credential: 'id_token',
  },
  facebook: {
    id: 'facebook',
    authorizeUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scope: 'email public_profile',
    clientIdEnv: 'FACEBOOK_CLIENT_ID',
    clientSecretEnv: 'FACEBOOK_CLIENT_SECRET',
    pkce: false,
    formPost: false,
    credential: 'access_token',
  },
  twitch: {
    id: 'twitch',
    authorizeUrl: 'https://id.twitch.tv/oauth2/authorize',
    tokenUrl: 'https://id.twitch.tv/oauth2/token',
    scope: 'user:read:email',
    clientIdEnv: 'TWITCH_CLIENT_ID',
    clientSecretEnv: 'TWITCH_CLIENT_SECRET',
    pkce: true,
    formPost: false,
    credential: 'access_token',
  },
}

export const isOAuthProvider = (value: string): value is OAuthProvider =>
  (OAUTH_PROVIDERS as readonly string[]).includes(value)

export const getOAuthProvider = (value: string): OAuthProviderConfig | undefined =>
  isOAuthProvider(value) ? CONFIGS[value] : undefined

/**
 * Where the browser starts the link flow. Kept here so both the client button
 * and the server route agree on the URL shape.
 */
export const getSignInPath = (provider: string, callbackUrl = '/profile'): string =>
  `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`

export interface OAuthCredentials {
  clientId: string
  clientSecret: string
}

export const getOAuthCredentials = (
  config: OAuthProviderConfig,
  env: Record<string, string | undefined> = process.env
): OAuthCredentials | undefined => {
  const clientId = env[config.clientIdEnv]
  const clientSecret = env[config.clientSecretEnv]
  if (!clientId || !clientSecret) return undefined
  return { clientId, clientSecret }
}

const toBase64Url = (bytes: Uint8Array): string => {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const randomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

/** Opaque, single-use value echoed back by the provider to bind the callback. */
export const createState = (): string => toBase64Url(randomBytes(32))

export interface PkcePair {
  verifier: string
  challenge: string
}

/** RFC 7636 S256 verifier/challenge pair. */
export const createPkcePair = async (): Promise<PkcePair> => {
  const verifier = toBase64Url(randomBytes(32))
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return { verifier, challenge: toBase64Url(new Uint8Array(digest)) }
}

export interface AuthorizeUrlInput {
  config: OAuthProviderConfig
  clientId: string
  redirectUri: string
  state: string
  challenge?: string
}

export const buildAuthorizeUrl = ({
  config,
  clientId,
  redirectUri,
  state,
  challenge,
}: AuthorizeUrlInput): string => {
  const url = new URL(config.authorizeUrl)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', config.scope)
  url.searchParams.set('state', state)
  if (config.formPost) url.searchParams.set('response_mode', 'form_post')
  if (challenge) {
    url.searchParams.set('code_challenge', challenge)
    url.searchParams.set('code_challenge_method', 'S256')
  }
  return url.toString()
}

export interface TokenSet {
  accessToken?: string
  idToken?: string
  tokenType?: string
  scope?: string
  expiresIn?: number
}

interface TokenEndpointResponse {
  access_token?: string
  id_token?: string
  token_type?: string
  scope?: string
  expires_in?: number
  error?: string
  error_description?: string
}

export interface ExchangeCodeInput {
  config: OAuthProviderConfig
  clientId: string
  clientSecret: string
  code: string
  redirectUri: string
  verifier?: string
}

/**
 * Exchanges an authorization code for tokens.
 *
 * Both flavours of client authentication are sent: the credentials belong to
 * confidential clients (all four providers issue a secret), and the body-encoded
 * pair is what Google, Facebook and Twitch accept, while Apple requires it.
 */
export const exchangeCodeForTokens = async ({
  config,
  clientId,
  clientSecret,
  code,
  redirectUri,
  verifier,
}: ExchangeCodeInput): Promise<TokenSet> => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  })
  if (verifier) body.set('code_verifier', verifier)

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body,
  })

  const payload = (await response.json().catch(() => ({}))) as TokenEndpointResponse
  if (!response.ok || payload.error) {
    throw new Error(
      payload.error_description ?? payload.error ?? `Token exchange failed (${response.status})`
    )
  }

  return {
    accessToken: payload.access_token,
    idToken: payload.id_token,
    tokenType: payload.token_type,
    scope: payload.scope,
    expiresIn: payload.expires_in,
  }
}

/**
 * The token PlayFab expects when linking an account for this provider.
 *
 * Google, Facebook and Twitch link through the OAuth access token; Apple links
 * through the OIDC identity token. The previous next-auth wiring always read
 * `account.access_token`, so Apple links carried `undefined`.
 */
export const getLinkCredential = (
  config: OAuthProviderConfig,
  tokens: TokenSet
): string | undefined =>
  config.credential === 'id_token' ? (tokens.idToken ?? tokens.accessToken) : tokens.accessToken
