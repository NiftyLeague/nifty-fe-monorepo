'use client'

import { useAccount, useSignMessage } from '@/runtime/wagmi'

import * as gtm from '@nl/ui/gtm/events'
import type { AUTH_Token, UUID_Token, Nonce } from '@/types/auth'
import { WALLET_VERIFICATION } from '@/constants/auth-urls'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import { useNonce, useUUIDToken } from '@/hooks/useAuthStorage'
import { setAuthToken, setNonce, setUUIDToken } from '@/state/auth-storage'

type Param<T> = T | (() => T | undefined)
type Params = { auth?: AUTH_Token; token?: Param<UUID_Token>; nonce?: Param<Nonce> }

const resolveParam = <T>(param?: Param<T>) =>
  (typeof param === 'function' ? (param as () => T | undefined)() : param) as T | undefined

const useSignAuthMsg = (params: Params = {}) => {
  const { setIsLoggedIn } = useAuthStatus()
  const account = useAccount()
  const addressToLower = () => account.address?.toLowerCase()
  const signAddress = () => `${addressToLower()?.slice(0, 6)}...${addressToLower()?.slice(-4)}`

  const uuidToken = useUUIDToken()
  const storageNonce = useNonce()

  const token = () => resolveParam(params.token) || uuidToken()
  const nonce = () => resolveParam(params.nonce) || storageNonce()

  const verifyWallet = async (verification: string) => {
    const address = addressToLower()
    try {
      if (!address) return
      const result = await fetch(WALLET_VERIFICATION, {
        method: 'POST',
        body: JSON.stringify({ token: token(), nonce: nonce(), verification, address }),
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
        setUUIDToken(token())
        setNonce(nonce())

        setIsLoggedIn(true)
        gtm.sendUserId(address)
      } else {
        throw Error('Failed to verify signature!')
      }
    } catch (err) {
      console.error('verifyWallet', err)
      setIsLoggedIn(false)
      gtm.removeUserId()
    }
  }

  const signMutation = useSignMessage({
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

  const signMessage = async () => {
    return await signMutation.signMessageAsync({
      message: `Please sign this message to verify that ${signAddress()} belongs to you. ${nonce()}`,
    })
  }

  return {
    signMessage,
    get isError() {
      return signMutation.isError
    },
    get isSuccess() {
      return signMutation.isSuccess
    },
  }
}

export default useSignAuthMsg
