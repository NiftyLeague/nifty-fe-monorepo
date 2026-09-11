'use client'

import { useCallback, useState, useMemo } from 'react'

import { cn } from '@nl/ui/utils'
import { SocialIconButton } from '@nl/ui/custom/social-icon-button'
import { getOAuthProvider, getSignInPath } from '../../auth/oauth'
import { useUserContext } from '../../hooks/useUserContext'
import { fetchJson } from '../../utils/fetchJson'
import type { Provider, UserContextType } from '../../types'

export interface Props {
  providers: Provider[]
  socialLayout?: 'horizontal' | 'vertical'
  loading?: boolean
}

/**
 * Starts the authorization-code flow. The callback route links the provider to
 * the signed-in PlayFab account server-side, so no provider token ever reaches
 * the browser; this only has to leave the page.
 */
const handleSignIn = (provider: Provider) => {
  if (!getOAuthProvider(provider)) return
  window.location.assign(getSignInPath(provider))
}

export default function LinkedProviders({
  providers,
  socialLayout = 'horizontal',
  loading = false,
}: Props) {
  const player: UserContextType = useUserContext()
  const [optimisticUnlinked, setOptimisticUnlinked] = useState<Provider[]>([])

  // Linking is server-side, so the linked set is whatever PlayFab reports; only
  // unlinks need local optimism, since the refetch that confirms them is async.
  const linkedProviders = useMemo(() => {
    const fromProfile =
      player.profile?.LinkedAccounts?.map((p) =>
        p.Platform === 'GooglePlay' ? 'google' : p.Platform?.toLowerCase()
      ) || []
    return [...new Set(fromProfile)].filter((p) => !optimisticUnlinked.includes(p as never))
  }, [player.profile, optimisticUnlinked])

  const handleUnlinkProvider = useCallback(async (provider: Provider) => {
    try {
      setOptimisticUnlinked((prev) => [...prev, provider])
      await fetchJson('/api/playfab/user/unlink-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      })
    } catch (e) {
      console.error(e)
      setOptimisticUnlinked((prev) => prev.filter((p) => p !== provider))
    }
  }, [])

  return providers && providers.length > 0 ? (
    <div
      className={cn(
        'w-full grid gap-2',
        socialLayout === 'horizontal' && 'grid-cols-2 md:grid-cols-4'
      )}
    >
      {providers.map((provider) => {
        const isLinked = linkedProviders.includes(provider)
        return (
          <div key={provider} className="w-full">
            <SocialIconButton
              key={provider}
              label={isLinked ? 'Unlink' : 'Sign in'}
              onClick={
                isLinked ? () => handleUnlinkProvider(provider) : () => handleSignIn(provider)
              }
              provider={provider}
              withColor={isLinked}
              disabled={loading}
            />
          </div>
        )
      })}
    </div>
  ) : null
}
