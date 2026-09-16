import { createEffect, onCleanup, on } from 'solid-js'
import { useAccount } from '@/runtime/wagmi'

import { ADDRESS_VERIFICATION } from '@/constants/auth-urls'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import { useAuthToken } from '@/hooks/useAuthStorage'
import { clearAllAuth } from '@/state/auth-storage'

/**
 * Address verification is memoized at module scope so every caller — and
 * every wallet-auth provider stack on a page — shares one result per
 * (token, address) pair, including one shared in-flight request.
 */
let verificationCache: { key?: string; verified: boolean } = { verified: false }
let inFlightKey: string | undefined
let inFlight: Promise<boolean> | undefined

const verificationKey = (address: string, token: string) => `${token}:${address.toLowerCase()}`

const fetchVerification = async (address: string, token: string): Promise<boolean> => {
  const key = verificationKey(address, token)
  if (verificationCache.key === key) return verificationCache.verified
  if (inFlight && inFlightKey === key) return inFlight

  inFlightKey = key
  inFlight = fetch(ADDRESS_VERIFICATION, { headers: { authorizationToken: token } })
    .then((res) => {
      if (res.status === 404) return null
      return res.text()
    })
    .then((result) => {
      const verified = Boolean(result && result.slice(1, -1) === address.toLowerCase())
      verificationCache = { key, verified }
      return verified
    })
    .catch(() => false)
    .finally(() => {
      inFlight = undefined
      inFlightKey = undefined
    })

  return inFlight
}

const useCheckAuth = () => {
  const account = useAccount()
  const auth = useAuthStatus()
  const authToken = useAuthToken()

  const checkAddress = async () => {
    const address = account.address
    const token = authToken()
    if (!token || !address) return false
    return fetchVerification(address, token)
  }

  createEffect(
    on(
      () => [account.address, authToken(), auth.isLoggedIn] as const,
      ([address, token, loggedIn]) => {
        if (loggedIn && (!token || !address)) {
          auth.setIsLoggedIn(false)
          return
        }
        if (!token || !address) return

        let cancelled = false
        onCleanup(() => {
          cancelled = true
        })
        void (async () => {
          const verified = await fetchVerification(address, token)
          if (cancelled) return
          if (verified) {
            auth.setIsLoggedIn(true)
          } else {
            auth.setIsLoggedIn(false)
            clearAllAuth()
          }
        })()
      },
      { defer: true }
    )
  )

  return { checkAddress }
}

export default useCheckAuth
