'use client'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { DEFERRED_RETRY_BUTTON_CLASS } from '@nl/ui/lib/deferred-boundary'

import { desktopNavigationMediaQuery } from '@/layouts/_layout/navigation-breakpoints'

type PublicUserProfileProps = {
  placement: 'desktop' | 'mobile'
}

const loadPublicUserProfile = () => import('./PublicUserProfile')

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

function ProfileProviderError({ retry }: { retry: () => void }) {
  return (
    <div
      class="flex flex-col items-center gap-3 rounded-lg bg-muted p-4 text-center"
      role="alert"
    >
      <p class="text-sm">Sign-in is temporarily unavailable.</p>
      <button type="button" class={DEFERRED_RETRY_BUTTON_CLASS} onClick={retry}>
        Retry
      </button>
    </div>
  )
}

export default function DeferredPublicUserProfile({ placement }: PublicUserProfileProps) {
  const isDesktop = useMediaQuery(desktopNavigationMediaQuery)
  const isVisiblePlacement = placement === 'desktop' ? isDesktop : !isDesktop
  const {
    Component: PublicUserProfile,
    hasError,
    retry,
  } = useDeferredComponent<PublicUserProfileProps>(loadPublicUserProfile, isVisiblePlacement)

  if (isVisiblePlacement && PublicUserProfile) {
    return <PublicUserProfile placement={placement} />
  }

  return (
    <div data-public-user-profile data-placement={placement}>
      {isVisiblePlacement && hasError ? (
        <ProfileProviderError retry={retry} />
      ) : (
        <ProfileProviderLoading />
      )}
    </div>
  )
}
