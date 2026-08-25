'use client'

import dynamic from 'next/dynamic'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

import WalletAuthProvidersBoundary from '@/contexts/WalletAuthProvidersBoundary'

const DeferredUserProfile = dynamic(() => import('@/components/UserProfile'), {
  ssr: false,
  loading: () => <DeferredSkeleton className="h-44 w-full rounded-lg" />,
})

export default function PublicUserProfile() {
  return (
    <div data-public-user-profile>
      <WalletAuthProvidersBoundary>
        <DeferredUserProfile />
      </WalletAuthProvidersBoundary>
    </div>
  )
}
