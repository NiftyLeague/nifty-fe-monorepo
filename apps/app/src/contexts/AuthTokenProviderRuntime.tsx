'use client'

import { createEffect, createMemo } from 'solid-js'
import { useAccount } from 'wagmi'

import type { AuthTokenContextType } from '@/types/auth'
import AuthTokenContext from '@/contexts/AuthTokenContext'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import useCheckAuth from '@/hooks/useCheckAuth'
import { useAuthToken } from '@/hooks/useAuthStorage'
import useSignAuthMsg from '@/hooks/useSignAuthMsg'
import { DEBUG } from '@/constants/index'

export default function AuthTokenProviderRuntime({ children }: { children?: JSX.Element }) {
  const { isConnected } = useAccount()
  const { isLoggedIn } = useAuthStatus()
  const { checkAddress } = useCheckAuth()
  const { signMessage } = useSignAuthMsg()
  const authToken = useAuthToken()
  let msgSent: any = false
  let connectedRef: any = isConnected

  const signMsg = (async () => {
    const initialized = await checkAddress()
    if (!initialized) await signMessage()
    msgSent.current = true
  }, [checkAddress, signMessage])

  const handleConnectWallet = (async () => {
    if (!isConnected) {
      const { openWalletModal } = await import('@/contexts/WalletModal')
      await openWalletModal()
      return
    }
    await signMsg()
  }, [isConnected, signMsg])

  createEffect(() => {
    const connected = connectedRef.current
    connectedRef.current = isConnected

    if (!connected && isConnected && !isLoggedIn && msgSent.current === false) {
      if (DEBUG) console.log('CONNECT_SUCCESS')
      msgSent.current = true
      void signMsg()
    }
  }, [isConnected, isLoggedIn, signMsg])

  const value = useMemo<AuthTokenContextType>(
    () => ({ authToken, handleConnectWallet, isConnected, isLoggedIn }),
    [authToken, handleConnectWallet, isConnected, isLoggedIn]
  )

  return <AuthTokenContext.Provider value={value}>{children}</AuthTokenContext.Provider>
}
