'use client'

import { useCallback } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

import * as gtm from '@nl/ui/gtm/events'
import type { AUTH_Token, UUID_Token, Nonce } from '@/types/auth'
import { WALLET_VERIFICATION } from '@/constants/auth-urls'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'

type Params = { auth?: AUTH_Token; token?: UUID_Token; nonce?: Nonce }

const useSignAuthMsg = (params: Params = {}) => {
  const { setIsLoggedIn } = useAuthStatus()
  const { address } = useAccount()
  const addressToLower = address?.toLowerCase()
  const signAddress = `${addressToLower?.slice(0, 6)}...${addressToLower?.slice(-4)}`

  const {
    setAuthToken,
    uuidToken,
    setUUIDToken,
    nonce: storageNonce,
    setNonce,
  } = useLocalStorageContext()

  const token = params.token || uuidToken
  const nonce = params.nonce || storageNonce

  const verifyWallet = async (verification: string) => {
    try {
      if (!addressToLower) return
      const result = await fetch(WALLET_VERIFICATION, {
        method: 'POST',
        body: JSON.stringify({ token, nonce, verification, address: addressToLower }),
      })
        .then((res) => {
          if (res.status === 404) {
            throw Error('Failed to verify signature!')
          }
          return res.text()
        })
        .catch(() => {
          throw Error('Failed to verify signature!')
        })

      if (result?.length) {
        const auth = result.slice(1, -1)
        setAuthToken(auth)
        setUUIDToken(token)
        setNonce(nonce)

        setIsLoggedIn(true)
        gtm.sendUserId(addressToLower)
      } else {
        throw Error('Failed to verify signature!')
      }
    } catch (err) {
      console.error('verifyWallet', err)
      setIsLoggedIn(false)
      gtm.removeUserId()
    }
  }

  const { signMessageAsync, isError, isSuccess } = useSignMessage({
    mutation: {
      onSuccess(data) {
        verifyWallet(data)
      },
      onError(error) {
        console.error('useSignMessage', error)
        setIsLoggedIn(false)
      },
    },
  })

  const signMessage = useCallback(async () => {
    return await signMessageAsync({
      message: `Please sign this message to verify that ${signAddress} belongs to you. ${nonce}`,
    })
  }, [signAddress, nonce, signMessageAsync])

  return { signMessage, isError, isSuccess }
}

export default useSignAuthMsg
