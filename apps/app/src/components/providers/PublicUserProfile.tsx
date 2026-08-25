'use client'

import dynamic from 'next/dynamic'

import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useDeferredActivation from '@nl/ui/hooks/useDeferredActivation'

import WalletAuthProvidersBoundary from '@/contexts/WalletAuthProvidersBoundary'

const DeferredUserProfile = dynamic(() => import('@/components/UserProfile'), {
  ssr: false,
  loading: () => <DeferredSkeleton className="h-44 w-full rounded-lg" />,
})

function ProfileProviderLoading() {
  return (
    <div
      className="flex flex-col items-center rounded-lg bg-muted p-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading profile and login controls"
    >
      <DeferredSkeleton className="size-20 rounded-full" />
      <DeferredSkeleton className="my-2 h-5 w-32" />
      <DeferredSkeleton className="h-9 w-full rounded-md" />
    </div>
  )
}

function ProfileProviderError({ retry }: { retry: () => void }) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-lg bg-muted p-4 text-center"
      role="alert"
    >
      <p className="text-sm">Sign-in is temporarily unavailable.</p>
      <Button type="button" variant="outline" className="w-full" onClick={retry}>
        Retry
      </Button>
    </div>
  )
}

export default function PublicUserProfile() {
  const isActivated = useDeferredActivation()

  return (
    <div data-public-user-profile>
      <WalletAuthProvidersBoundary
        enabled={isActivated}
        errorFallback={(retry) => <ProfileProviderError retry={retry} />}
        loadingFallback={<ProfileProviderLoading />}
      >
        <DeferredUserProfile />
      </WalletAuthProvidersBoundary>
    </div>
  )
}
