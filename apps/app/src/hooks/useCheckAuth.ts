'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'

import { ADDRESS_VERIFICATION } from '@/constants/auth-urls'
import { useAuthStatus } from '@/contexts/AuthStatusContext'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'

const useCheckAuth = () => {
  const { address } = useAccount()
  const { isLoggedIn, setIsLoggedIn } = useAuthStatus()
  const { authToken, clearAllAuth } = useLocalStorageContext()
  const cache = useRef({ address, authToken, verified: false })
  const firstRenderRef = useRef(true)

  const checkAddress = useCallback(async () => {
    if (authToken && address) {
      if (
        cache.current.verified &&
        authToken === cache.current.authToken &&
        address == cache.current.address
      ) {
        return true
      }

      const result = await fetch(ADDRESS_VERIFICATION, {
        headers: { authorizationToken: authToken },
      })
        .then((res) => {
          if (res.status === 404) return null
          return res.text()
        })
        .catch(() => null)
      if (result && result.slice(1, -1) === address.toLowerCase()) {
        cache.current = { address, authToken, verified: true }
        return true
      }
      cache.current.verified = false
      return false
    }
    cache.current.verified = false
    return false
  }, [address, authToken])

  const verify = useCallback(async () => {
    const addressVerified = await checkAddress()
    if (addressVerified) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
      clearAllAuth()
    }
  }, [checkAddress, clearAllAuth, setIsLoggedIn])

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    if (isLoggedIn && (!authToken || !address)) setIsLoggedIn(false)
    else if (authToken && address) void verify()
  }, [address, authToken, isLoggedIn, setIsLoggedIn, verify])

  return { checkAddress, verify }
}

export default useCheckAuth
