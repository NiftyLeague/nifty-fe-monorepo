'use client'

import { createContext, useMemo, type PropsWithChildren } from 'react'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

import type { AuthTokenContextType } from '@/types/auth'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const AuthTokenContext = createContext<AuthTokenContextType | null>(null)

const loadAuthTokenRuntime = () => import('./AuthTokenProviderRuntime')

const openWalletModal = async () => {
  const { openWalletModal: open } = await import('@/contexts/WalletModal')
  await open()
}

export const AuthTokenProvider = ({ children }: PropsWithChildren) => {
  const { isLoggedIn } = useAuthStatus()
  const { authToken } = useLocalStorageContext()
  const { Component: Runtime } = useDeferredComponent<PropsWithChildren>(loadAuthTokenRuntime)

  const fallbackValue = useMemo(
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
