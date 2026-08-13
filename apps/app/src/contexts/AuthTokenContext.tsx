'use client'

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type PropsWithChildren,
} from 'react'

import type { AuthTokenContextType } from '@/types/auth'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const AuthTokenContext = createContext<AuthTokenContextType | null>(null)

type AuthTokenRuntimeComponent = ComponentType<PropsWithChildren>

const loadAuthTokenRuntime = () => import('./AuthTokenProviderRuntime')

const openWalletModal = async () => {
  const { openWalletModal: open } = await import('@/contexts/WalletModal')
  await open()
}

export const AuthTokenProvider = ({ children }: PropsWithChildren) => {
  const { isLoggedIn } = useAuthStatus()
  const { authToken } = useLocalStorageContext()
  const [Runtime, setRuntime] = useState<AuthTokenRuntimeComponent | null>(null)

  useEffect(() => {
    let active = true

    loadAuthTokenRuntime()
      .then(({ default: nextRuntime }) => {
        if (active) setRuntime(() => nextRuntime)
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

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
