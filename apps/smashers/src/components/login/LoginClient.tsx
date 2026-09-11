'use client'

import { useEffect } from 'react'
import type { User } from '@nl/playfab/types'
import PlayFabAuthForm from '@nl/playfab/components/PlayFabAuthForm'
import BackButton from '@/components/Header/BackButton'
import AuthProviders from '@/contexts/AuthProviders'
import useFlags from '@/hooks/useFlags'

interface SessionData {
  user: User | null
}

/**
 * The interactive login island.
 *
 * It renders the providers itself rather than being wrapped by them in the
 * layout. Astro gives every `client:*` element its own React root, so a
 * provider island in `Auth.astro` could not supply context to this one: the
 * feature flags below read as `{}`, which hid account creation and provider
 * sign-on regardless of configuration. Keeping providers and consumers in one
 * root is what makes them share state.
 */
export default function LoginClient({ sessionData }: { sessionData: SessionData }) {
  return (
    <AuthProviders>
      <LoginContent sessionData={sessionData} />
    </AuthProviders>
  )
}

/**
 * Inner body, inside the provider root. Not exported: mounting it directly
 * would reintroduce the split-root bug this split exists to prevent.
 */
function LoginContent({ sessionData: _sessionData }: { sessionData: SessionData }) {
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
