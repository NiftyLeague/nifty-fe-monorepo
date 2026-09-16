import type { SetStateAction } from '@/types'

import type { AgreementAccepted, AUTH_Token, Nonce, USER_ID, UUID_Token } from '@/types/auth'
import { createNonce, createUUID } from '@/utils/auth'
import { getLocalStorageStore } from '@/state/local-storage-store'
import { purgeAuthenticatedQueries } from '@/query/app-query'

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
  authTokenStore.set(next)
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
