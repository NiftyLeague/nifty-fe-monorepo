'use client'

import { useStore } from 'zustand'

import { agreementStore, authTokenStore, nonceStore, uuidTokenStore } from '@/state/auth-storage'

/**
 * Selector hooks over the auth local-storage stores. Each field subscribes
 * independently, so e.g. a uuid rotation never re-renders token consumers and
 * a favorites update re-renders none of them.
 */
export const useAuthToken = () => useStore(authTokenStore, (state) => state.value)
export const useUUIDToken = () => useStore(uuidTokenStore, (state) => state.value)
export const useNonce = () => useStore(nonceStore, (state) => state.value)
export const useAgreementAccepted = () => useStore(agreementStore, (state) => state.value)
