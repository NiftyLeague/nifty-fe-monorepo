'use client'

import { useEffect } from 'react'
import useSWR from 'swr'

import type { User } from '../types'
import fetchJson from '../utils/fetchJson'

/**
 * Full-page navigation kept framework-neutral: the consuming app is Astro SSR,
 * so these hooks no longer have a Next router instance to push through.
 */
export const navigate = (href: string): void => {
  if (typeof window === 'undefined') return
  window.location.assign(href)
}

export function useUserSession({ redirectTo = '', redirectIfFound = false } = {}) {
  const { data: user, mutate: mutateUser } = useSWR<User>(
    '/api/playfab/user/playfab-session',
    fetchJson
  )

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      navigate(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo])

  return { user, mutateUser }
}

export default useUserSession
