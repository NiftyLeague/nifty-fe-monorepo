import { agreementStore, authTokenStore, nonceStore, uuidTokenStore } from '@/state/auth-storage'

/**
 * Selector hooks over the auth local-storage stores. Each field subscribes
 * independently, so e.g. a uuid rotation never re-renders token consumers and
 * a favorites update re-renders none of them.
 */
export const useAuthToken = () => authTokenStore.value
export const useUUIDToken = () => uuidTokenStore.value
export const useNonce = () => nonceStore.value
export const useAgreementAccepted = () => agreementStore.value
