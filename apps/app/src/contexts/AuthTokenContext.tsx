'use client'

import { createContext, Show, type JSX } from 'solid-js'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

import type { AuthTokenContextType } from '@/types/auth'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import { useAuthToken } from '@/hooks/useAuthStorage'

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const AuthTokenContext = createContext<AuthTokenContextType | null>(null)

const loadAuthTokenRuntime = () => import('./AuthTokenProviderRuntime')

const openWalletModal = async () => {
  const { openWalletModal: open } = await import('@/contexts/WalletModal')
  await open()
}

export const AuthTokenProvider = (props: { children?: JSX.Element }) => {
  const auth = useAuthStatus()
  const authToken = useAuthToken()
  const { Component: Runtime } = useDeferredComponent<{ children?: JSX.Element }>(
    loadAuthTokenRuntime
  )

  const fallbackValue: AuthTokenContextType = {
    get authToken() {
      return authToken()
    },
    handleConnectWallet: openWalletModal,
    isConnected: false,
    get isLoggedIn() {
      return auth.isLoggedIn
    },
  }

  return (
    <Show when={Runtime()} keyed fallback={<AuthTokenContext.Provider value={fallbackValue}>{props.children}</AuthTokenContext.Provider>}>
      {(Loaded) => <Loaded>{props.children}</Loaded>}
    </Show>
  )
}

export default AuthTokenContext
