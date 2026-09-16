import { createEffect, type JSX } from 'solid-js'
import { useAccount } from '@/runtime/wagmi'

import type { AuthTokenContextType } from '@/types/auth'
import AuthTokenContext from '@/contexts/AuthTokenContext'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import useCheckAuth from '@/hooks/useCheckAuth'
import { useAuthToken } from '@/hooks/useAuthStorage'
import useSignAuthMsg from '@/hooks/useSignAuthMsg'
import { DEBUG } from '@/constants/index'

export default function AuthTokenProviderRuntime(props: { children?: JSX.Element }) {
  const account = useAccount()
  const auth = useAuthStatus()
  const { checkAddress } = useCheckAuth()
  const { signMessage } = useSignAuthMsg()
  const authToken = useAuthToken()
  let msgSent = false
  let wasConnected = account.isConnected

  const signMsg = async () => {
    const initialized = await checkAddress()
    if (!initialized) await signMessage()
    msgSent = true
  }

  const handleConnectWallet = async () => {
    if (!account.isConnected) {
      const { openWalletModal } = await import('@/contexts/WalletModal')
      await openWalletModal()
      return
    }
    await signMsg()
  }

  createEffect(() => {
    const connected = account.isConnected
    const loggedIn = auth.isLoggedIn
    const previouslyConnected = wasConnected
    wasConnected = connected

    if (!previouslyConnected && connected && !loggedIn && !msgSent) {
      if (DEBUG) console.log('CONNECT_SUCCESS')
      msgSent = true
      void signMsg()
    }
  })

  const value: AuthTokenContextType = {
    get authToken() {
      return authToken()
    },
    handleConnectWallet,
    get isConnected() {
      return account.isConnected
    },
    get isLoggedIn() {
      return auth.isLoggedIn
    },
  }

  return <AuthTokenContext.Provider value={value}>{props.children}</AuthTokenContext.Provider>
}
