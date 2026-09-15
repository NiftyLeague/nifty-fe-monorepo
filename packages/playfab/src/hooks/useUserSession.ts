import { createEffect, createResource } from 'solid-js'

import type { User } from '../types'
import fetchJson from '../utils/fetchJson'

/**
 * Full-page navigation kept framework-neutral: the consuming app is Astro SSR,
 * so these hooks no longer have a framework router instance to push through.
 */
export const navigate = (href: string): void => {
  if (typeof window === 'undefined') return
  window.location.assign(href)
}

export function useUserSession({ redirectTo = '', redirectIfFound = false } = {}) {
  const [user, { mutate }] = createResource<User>(
    () => fetchJson<User>('/api/playfab/user/playfab-session'),
    { initialValue: undefined as unknown as User }
  )

  createEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    const current = user()
    if (!redirectTo || !current) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !current?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && current?.isLoggedIn)
    ) {
      navigate(redirectTo)
    }
  })

  const mutateUser = (next: User) => {
    void mutate(() => next)
  }

  return { user, mutateUser }
}

export default useUserSession
