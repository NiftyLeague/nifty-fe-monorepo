'use client'

import dynamic from '@/runtime/dynamic'
import { createSignal, Match, Show, Switch } from 'solid-js'

import { Avatar, AvatarFallback } from '@nl/ui/base/avatar'
import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { UserRound } from 'lucide-solid'

import { desktopNavigationMediaQuery } from '@/layouts/_layout/navigation-breakpoints'
import WalletAuthProvidersBoundary from '@/contexts/WalletAuthProvidersBoundary'

type PublicUserProfileProps = {
  placement: 'desktop' | 'mobile'
}

const DeferredUserProfile = dynamic(() => import('@/components/UserProfile'), {
  ssr: false,
  loading: () => <DeferredSkeleton class="h-44 w-full rounded-lg" />,
})

function ProfileProviderLoading() {
  return (
    <div
      class="flex flex-col items-center rounded-lg bg-muted p-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading profile and login controls"
    >
      <DeferredSkeleton class="size-20 rounded-full" />
      <DeferredSkeleton class="my-2 h-5 w-32" />
      <DeferredSkeleton class="h-9 w-full rounded-md" />
    </div>
  )
}

function ProfileProviderError(props: { retry: () => void }) {
  return (
    <div
      class="flex flex-col items-center gap-3 rounded-lg bg-muted p-4 text-center"
      role="alert"
    >
      <p class="text-sm">Sign-in is temporarily unavailable.</p>
      <Button type="button" variant="outline" class="w-full" onClick={props.retry}>
        Retry
      </Button>
    </div>
  )
}

function SignedOutProfile(props: { onConnect: () => void }) {
  return (
    <div
      data-public-signed-out-profile
      class="flex flex-col items-center rounded-lg bg-muted p-4"
      style={{ border: 'var(--border-default)' }}
    >
      <Avatar class="size-20">
        <AvatarFallback>
          <UserRound
            aria-hidden="true"
            class="size-10 text-muted-foreground"
            stroke-width={1.5}
          />
        </AvatarFallback>
      </Avatar>
      <div class="my-2 flex flex-col items-center">
        <span>Login to view dashboards</span>
      </div>
      <Button type="button" class="w-full" onClick={props.onConnect}>
        Connect Account
      </Button>
    </div>
  )
}

export default function PublicUserProfile(props: PublicUserProfileProps) {
  const isDesktop = useMediaQuery(desktopNavigationMediaQuery)
  const isVisiblePlacement = () =>
    props.placement === 'desktop' ? isDesktop() : !isDesktop()
  const [walletRequested, setWalletRequested] = createSignal(false)
  const [modalError, setModalError] = createSignal(false)

  const handleConnectWallet = () => {
    setWalletRequested(true)
    void import('@/contexts/WalletModal')
      .then(({ openWalletModal }) => openWalletModal())
      .catch(() => setModalError(true))
  }

  const retryWalletModal = () => {
    setModalError(false)
    setWalletRequested(false)
  }

  return (
    <div data-public-user-profile data-placement={props.placement}>
      <Show when={isVisiblePlacement()} fallback={<ProfileProviderLoading />}>
        <Switch>
          <Match when={modalError()}>
            <ProfileProviderError retry={retryWalletModal} />
          </Match>
          <Match when={walletRequested()}>
            <WalletAuthProvidersBoundary
              enabled
              errorFallback={(retry) => <ProfileProviderError retry={retry} />}
              loadingFallback={<ProfileProviderLoading />}
            >
              <DeferredUserProfile />
            </WalletAuthProvidersBoundary>
          </Match>
          <Match when={true}>
            <SignedOutProfile onConnect={handleConnectWallet} />
          </Match>
        </Switch>
      </Show>
    </div>
  )
}
