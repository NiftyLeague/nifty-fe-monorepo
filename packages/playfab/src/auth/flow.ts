/**
 * Short-lived signed state for the OAuth authorization-code round trip.
 *
 * Pure data helpers only: they encrypt/decrypt the flow payload with the same
 * secret iron-session uses for the PlayFab cookie, so the route handlers and
 * their tests do not each re-implement sealing.
 */
import { sealData, unsealData } from 'iron-session'

import { isOAuthProvider, type OAuthProvider } from './oauth'

export const OAUTH_FLOW_COOKIE = 'oauth_flow'

/**
 * Ten minutes is long enough for a provider consent screen (including Apple's
 * two-factor step) and short enough that an abandoned flow cannot be replayed
 * much later.
 */
export const OAUTH_FLOW_TTL_SECONDS = 600

export interface OAuthFlowState {
  provider: OAuthProvider
  state: string
  verifier?: string
  callbackUrl: string
}

const isSafeCallbackUrl = (value: string): boolean =>
  value.startsWith('/') && !value.startsWith('//')

export const sealFlowState = (flow: OAuthFlowState, password: string): Promise<string> =>
  sealData(flow, { password, ttl: OAUTH_FLOW_TTL_SECONDS })

/**
 * Returns `undefined` for anything that is not a well-formed, unexpired,
 * untampered flow — the caller must then reject the callback rather than start
 * an implicit flow.
 */
export const unsealFlowState = async (
  seal: string | undefined,
  password: string,
  provider: string
): Promise<OAuthFlowState | undefined> => {
  if (!seal) return undefined

  let payload: unknown
  try {
    payload = await unsealData(seal, { password, ttl: OAUTH_FLOW_TTL_SECONDS })
  } catch {
    return undefined
  }
  if (!payload || typeof payload !== 'object') return undefined

  const {
    provider: sealedProvider,
    state,
    verifier,
    callbackUrl,
  } = payload as Partial<OAuthFlowState>
  if (typeof state !== 'string' || state.length === 0) return undefined
  if (typeof sealedProvider !== 'string' || !isOAuthProvider(sealedProvider)) return undefined
  // The provider in the URL path must match the one the flow was started with,
  // otherwise a code from one provider could be redeemed against another.
  if (sealedProvider !== provider) return undefined
  if (verifier !== undefined && typeof verifier !== 'string') return undefined
  if (typeof callbackUrl !== 'string' || !isSafeCallbackUrl(callbackUrl)) return undefined

  return { provider: sealedProvider, state, verifier, callbackUrl }
}

/** Constant-time comparison so the state check cannot be probed by timing. */
export const statesMatch = (expected: string, received: string | null): boolean => {
  if (!received || expected.length !== received.length) return false

  let mismatch = 0
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ received.charCodeAt(index)
  }
  return mismatch === 0
}
