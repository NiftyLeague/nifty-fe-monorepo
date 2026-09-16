import { createEffect } from 'solid-js'
import { useAccount } from '@/runtime/wagmi'

import { ADDRESS_VERIFICATION } from '@/constants/auth-urls'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import { useAuthToken } from '@/hooks/useAuthStorage'
import { clearAllAuth } from '@/state/auth-storage'

const useCheckAuth = () => {
  const account = useAccount()
  const auth = useAuthStatus()
  const authToken = useAuthToken()
  const cache = { address: account.address, authToken: authToken(), verified: false }
  let firstRender = true

  const checkAddress = async () => {
    const address = account.address
    const token = authToken()
    if (token && address) {
      if (cache.verified && token === cache.authToken && address == cache.address) {
        return true
      }

      const result = await fetch(ADDRESS_VERIFICATION, {
        headers: { authorizationToken: token },
      })
        .then((res) => {
          if (res.status === 404) return null
          return res.text()
        })
        .catch(() => null)
      if (result && result.slice(1, -1) === address.toLowerCase()) {
        cache.address = address
        cache.authToken = token
        cache.verified = true
        return true
      }
      cache.verified = false
      return false
    }
    cache.verified = false
    return false
  }

  const verify = async () => {
    const addressVerified = await checkAddress()
    if (addressVerified) {
      auth.setIsLoggedIn(true)
    } else {
      auth.setIsLoggedIn(false)
      clearAllAuth()
    }
  }

  createEffect(() => {
    const address = account.address
    const token = authToken()
    const loggedIn = auth.isLoggedIn

    if (firstRender) {
      firstRender = false
      return
    }

    if (loggedIn && (!token || !address)) auth.setIsLoggedIn(false)
    else if (token && address) void verify()
  })

  return { checkAddress, verify }
}

export default useCheckAuth
