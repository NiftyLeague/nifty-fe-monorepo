import { type JSX } from 'solid-js'
import { useAccount, useAccountTransition } from '@/runtime/wagmi'

import type { AuthTokenContextType } from '@/types/auth'
import AuthTokenContext from '@/contexts/AuthTokenContext'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import useCheckAuth from '@/hooks/useCheckAuth'
import { useAuthToken } from '@/hooks/useAuthStorage'
import useSignAuthMsg from '@/hooks/useSignAuthMsg'

export default function AuthTokenProviderRuntime(props: { children?: JSX.Element }) {
  const account = useAccount()
  const auth = useAuthStatus()
  const { checkAddress } = useCheckAuth()
  const { signMessage } = useSignAuthMsg()
  const authToken = useAuthToken()
  let msgSent = false

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

  // Event-driven: the transition fires once per connect edge with the prior
  // snapshot, so no manual latch bookkeeping runs on unrelated re-renders.
  useAccountTransition((next, prev) => {
    if (!prev.isConnected && next.isConnected && !auth.isLoggedIn && !msgSent) {
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