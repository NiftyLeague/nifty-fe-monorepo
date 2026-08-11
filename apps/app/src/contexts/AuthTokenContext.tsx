'use client'

import { createContext, useCallback, useRef, useEffect, type PropsWithChildren } from 'react'
import { useAccount } from 'wagmi'

import type { AuthTokenContextType } from '@/types/auth'
import { useSelector } from '@/store/hooks'
import useCheckAuth from '@/hooks/useCheckAuth'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'
import useSignAuthMsg from '@/hooks/useSignAuthMsg'
import { DEBUG } from '@/constants/index'

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const AuthTokenContext = createContext<AuthTokenContextType | null>(null)

export const AuthTokenProvider = ({ children }: PropsWithChildren) => {
  const { isConnected } = useAccount()
  const { checkAddress } = useCheckAuth()
  const { signMessage } = useSignAuthMsg()
  const { isLoggedIn } = useSelector((state) => state.account)
  const { authToken } = useLocalStorageContext()
  const msgSent = useRef(false)
  const connectedRef = useRef(isConnected)

  const signMsg = useCallback(async () => {
    const initialized = await checkAddress()
    if (!initialized) await signMessage()
    msgSent.current = true
  }, [checkAddress, signMessage])

  const handleConnectWallet = useCallback(async () => {
    if (!isConnected) {
      const { openWalletModal } = await import('@/contexts/WalletModal')
      await openWalletModal()
      return
    }
    await signMsg()
  }, [isConnected, signMsg])

  useEffect(() => {
    const connected = connectedRef.current
    connectedRef.current = isConnected

    if (!connected && isConnected && !isLoggedIn && msgSent.current === false) {
      if (DEBUG) console.log('CONNECT_SUCCESS')
      msgSent.current = true
      void signMsg()
    }
  }, [isConnected, isLoggedIn, signMsg])

  return (
    <AuthTokenContext.Provider value={{ authToken, handleConnectWallet, isConnected, isLoggedIn }}>
      {children}
    </AuthTokenContext.Provider>
  )
}

export default AuthTokenContext
