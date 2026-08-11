'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useSignAuthMsg from '@/hooks/useSignAuthMsg'
import useAuth from '@/hooks/useAuth'
import type { UUID_Token, Nonce } from '@/types/auth'

const GameVerification = (): React.ReactNode => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') as UUID_Token | undefined
  const nonce = searchParams.get('nonce') as Nonce | undefined
  const { signMessage, isError, isSuccess } = useSignAuthMsg({ token, nonce })
  const { isConnected, handleConnectWallet } = useAuth()
  const [msgSent, setMsgSent] = useState(false)

  useEffect(() => {
    const signMsg = async () => {
      if (!isConnected) handleConnectWallet()
      if (isConnected && nonce && token) {
        signMessage()
        setMsgSent(true)
      }
    }
    // eslint-disable-next-line no-void
    if (!msgSent) void signMsg()
  }, [handleConnectWallet, isConnected, msgSent, nonce, signMessage, token])

  return (
    <main className="container p-10 text-center" role="status" aria-live="polite">
      {isError || isSuccess ? (
        <>
          {isError && 'Error signing message'}
          {isSuccess &&
            'Successfully verified account! Please return to the Nifty League desktop app'}
        </>
      ) : (
        <>
          {isConnected
            ? 'Please sign message to verify address ownership'
            : 'Please connect your wallet'}
        </>
      )}
    </main>
  )
}

export default GameVerification
