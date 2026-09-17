import type { SetStateAction } from '@/types'

import type { AgreementAccepted, AUTH_Token, Nonce, USER_ID, UUID_Token } from '@/types/auth'
import { createNonce, createUUID } from '@/utils/auth'
import { getLocalStorageStore } from '@/state/local-storage-store'
import { purgeAuthenticatedQueries } from '@/query/app-query'

/**
 * A cookie mirror of the session token. localStorage is invisible to the
 * server, so dashboard route loaders cannot prefetch authenticated data
 * during SSR without it. The cookie is written by the same function that
 * owns the localStorage token, so the two can never disagree; being
 * JS-readable adds no exposure beyond localStorage itself.
 */
const AUTH_COOKIE_NAME = 'nl-auth-token'
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

/** Pure builder so the cookie contract is testable without a DOM cookie jar. */
export const buildAuthCookie = (token: AUTH_Token, protocol: string): string => {
  const secure = protocol === 'https:' ? '; secure' : ''
  if (token) {
    return `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; samesite=lax; max-age=${AUTH_COOKIE_MAX_AGE}${secure}`
  }
  return `${AUTH_COOKIE_NAME}=; path=/; samesite=lax; max-age=0${secure}`
}

const writeAuthCookie = (token: AUTH_Token): void => {
  if (typeof document === 'undefined') return
  document.cookie = buildAuthCookie(token, window.location.protocol)
}

/** Read the mirrored session token out of a raw Cookie header. */
export const readAuthCookieToken = (cookieHeader: string | null | undefined): AUTH_Token => {
  if (!cookieHeader) return undefined
  for (const pair of cookieHeader.split(';')) {
    const [name, ...rest] = pair.trim().split('=')
    if (name === AUTH_COOKIE_NAME) {
      try {
        return decodeURIComponent(rest.join('='))
      } catch {
        return undefined
      }
    }
  }
  return undefined
}

/**
 * Per-key reactive owners for the auth/identity fields that previously lived
 * in the LocalStorageContext mega-context. Storage keys and value formats are
 * pinned by docs/architecture/m1-state-and-data-layer.md as an M1 rollback
 * boundary and asserted by test/contract/m1-state-data-layer.test.ts.
 */
export const authTokenStore = getLocalStorageStore<AUTH_Token>('authentication-token', undefined)
// One generated fallback per page load, matching the legacy module-level defaults.
export const uuidTokenStore = getLocalStorageStore<UUID_Token>('uuid-token', createUUID())
export const nonceStore = getLocalStorageStore<Nonce>('nonce', createNonce())
const userIdStore = getLocalStorageStore<USER_ID>('user_id', undefined)
export const agreementStore = getLocalStorageStore<AgreementAccepted>(
  'aggreement-accepted',
  'FALSE'
)

export const setAuthToken = (next: SetStateAction<AUTH_Token>): void => {
  const resolved =
    typeof next === 'function'
      ? (next as (prev: AUTH_Token) => AUTH_Token)(authTokenStore.value())
      : next
  authTokenStore.set(() => resolved)
  writeAuthCookie(resolved)
}
export const setUUIDToken = (next: SetStateAction<UUID_Token>): void => {
  uuidTokenStore.set(next)
}
export const setNonce = (next: SetStateAction<Nonce>): void => {
  nonceStore.set(next)
}
export const setAgreementAccepted = (next: SetStateAction<AgreementAccepted>): void => {
  agreementStore.set(next)
}

export const clearAllAuth = () => {
  writeAuthCookie(undefined)
  // Token/scope-keyed cache entries must not survive a logout — otherwise the
  // previous session's profile, balance, and rental data stay readable until
  // garbage collection.
  purgeAuthenticatedQueries()
  authTokenStore.clear()
  // The user id has never had a writer; logout only clears it.
  userIdStore.clear()
  setUUIDToken(createUUID())
  setNonce(createNonce())
}
