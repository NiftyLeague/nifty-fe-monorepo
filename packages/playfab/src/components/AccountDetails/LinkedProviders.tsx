import { For, Show, createSignal } from 'solid-js'

import { cn } from '@nl/ui/utils'
import { SocialIconButton } from '@nl/ui/custom/social-icon-button'
import { getOAuthProvider, getSignInPath } from '../../auth/oauth'
import { useUserContext } from '../../hooks/useUserContext'
import { fetchJson } from '../../utils/fetchJson'
import type { Provider } from '../../types'

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

export default function LinkedProviders(props: Props) {
  const player = useUserContext()
  const [optimisticUnlinked, setOptimisticUnlinked] = createSignal<Provider[]>([])

  // Linking is server-side, so the linked set is whatever PlayFab reports; only
  // unlinks need local optimism, since the refetch that confirms them is async.
  const linkedProviders = () => {
    const fromProfile =
      player
        .userInfo()
        ?.PlayerProfile?.LinkedAccounts?.map((p: { Platform?: string }) =>
          p.Platform === 'GooglePlay' ? 'google' : p.Platform?.toLowerCase()
        ) || []
    return [...new Set(fromProfile)].filter((p) => !optimisticUnlinked().includes(p as never))
  }

  const handleUnlinkProvider = async (provider: Provider) => {
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
  }

  return (
    <Show when={props.providers && props.providers.length > 0}>
      <div
        class={cn(
          'w-full grid gap-2',
          props.socialLayout === 'horizontal' && 'grid-cols-2 md:grid-cols-4'
        )}
      >
        <For each={props.providers}>
          {(provider) => {
            const isLinked = linkedProviders().includes(provider)
            return (
              <div class="w-full">
                <SocialIconButton
                  label={isLinked ? 'Unlink' : 'Sign in'}
                  onClick={
                    isLinked ? () => handleUnlinkProvider(provider) : () => handleSignIn(provider)
                  }
                  provider={provider}
                  withColor={isLinked}
                  disabled={props.loading}
                />
              </div>
            )
          }}
        </For>
      </div>
    </Show>
  )
}
