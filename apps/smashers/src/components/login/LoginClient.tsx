'use client'

import { useEffect } from 'react'
import type { User } from '@nl/playfab/types'
import PlayFabAuthForm from '@nl/playfab/components/PlayFabAuthForm'
import BackButton from '@/components/Header/BackButton'
import useFlags from '@/hooks/useFlags'

interface SessionData {
  user: User | null
}

/**
 * The interactive login island.
 *
 * The Next version wrapped this in two more `dynamic(... ssr: false)` layers and
 * a Suspense boundary around a `useSearchParams` handler. Astro's `client:only`
 * island already defers the whole interactive graph, and the game-token logout
 * that the search-params handler performed is part of the PlayFab session
 * context now.
 */
export default function LoginClient({ sessionData: _sessionData }: { sessionData: SessionData }) {
  const { enableAccountCreation, enableProviderSignOn } = useFlags()

  // A stale `?game-token=` means a different launch already logged in; clearing
  // the PlayFab session first keeps the new launch from inheriting it.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('game-token')) return
    void fetch('/api/playfab/logout', { method: 'POST' })
      .then(() => window.location.reload())
      .catch(console.error)
  }, [])

  return (
    <>
      <BackButton />
      <PlayFabAuthForm
        enableAccountCreation={enableAccountCreation}
        enableProviderSignOn={enableProviderSignOn}
        redirectTo="/profile"
        view="login"
      />
    </>
  )
}
