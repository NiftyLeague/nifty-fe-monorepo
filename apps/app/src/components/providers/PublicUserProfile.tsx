'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'

import { Avatar, AvatarFallback } from '@nl/ui/base/avatar'
import { Button } from '@nl/ui/base/button'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { UserRound } from 'lucide-react'

import { desktopNavigationMediaQuery } from '@/app/_layout/navigation-breakpoints'
import WalletAuthProvidersBoundary from '@/contexts/WalletAuthProvidersBoundary'

type PublicUserProfileProps = {
  placement: 'desktop' | 'mobile'
}

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

function SignedOutProfile({ onConnect }: { onConnect: () => void }) {
  return (
    <div
      data-public-signed-out-profile
      className="flex flex-col items-center rounded-lg bg-muted p-4"
      style={{ border: 'var(--border-default)' }}
    >
      <Avatar className="size-20">
        <AvatarFallback>
          <UserRound
            aria-hidden="true"
            className="size-10 text-muted-foreground"
            strokeWidth={1.5}
          />
        </AvatarFallback>
      </Avatar>
      <div className="my-2 flex flex-col items-center">
        <span>Login to view dashboards</span>
      </div>
      <Button type="button" className="w-full" onClick={onConnect}>
        Connect Wallet
      </Button>
    </div>
  )
}

export default function PublicUserProfile({ placement }: PublicUserProfileProps) {
  const isDesktop = useMediaQuery(desktopNavigationMediaQuery)
  const isVisiblePlacement = placement === 'desktop' ? isDesktop : !isDesktop
  const [walletRequested, setWalletRequested] = useState(false)
  const [modalError, setModalError] = useState(false)

  const handleConnectWallet = useCallback(() => {
    setWalletRequested(true)
    void import('@/contexts/WalletModal')
      .then(({ openWalletModal }) => openWalletModal())
      .catch(() => setModalError(true))
  }, [])

  const retryWalletModal = useCallback(() => {
    setModalError(false)
    setWalletRequested(false)
  }, [])

  return (
    <div data-public-user-profile data-placement={placement}>
      {isVisiblePlacement ? (
        modalError ? (
          <ProfileProviderError retry={retryWalletModal} />
        ) : walletRequested ? (
          <WalletAuthProvidersBoundary
            enabled
            errorFallback={(retry) => <ProfileProviderError retry={retry} />}
            loadingFallback={<ProfileProviderLoading />}
          >
            <DeferredUserProfile />
          </WalletAuthProvidersBoundary>
        ) : (
          <SignedOutProfile onConnect={handleConnectWallet} />
        )
      ) : (
        <ProfileProviderLoading />
      )}
    </div>
  )
}
