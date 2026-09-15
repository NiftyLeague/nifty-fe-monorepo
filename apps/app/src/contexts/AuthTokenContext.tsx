'use client'

import { createContext, createMemo } from 'solid-js'

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

export const AuthTokenProvider = ({ children }: { children?: JSX.Element }) => {
  const { isLoggedIn } = useAuthStatus()
  const authToken = useAuthToken()
  const { Component: Runtime } = useDeferredComponent<{ children?: JSX.Element }>(loadAuthTokenRuntime)

  const fallbackValue = createMemo(
    () => ({
      authToken,
      handleConnectWallet: openWalletModal,
      isConnected: false,
      isLoggedIn,
    }),
    [authToken, isLoggedIn]
  )

  if (Runtime) return <Runtime>{children}</Runtime>

  return <AuthTokenContext.Provider value={fallbackValue}>{children}</AuthTokenContext.Provider>
}

export default AuthTokenContext
