'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadCommunityDegenCarousel = () => import('@/components/CommunityDegenCarousel')
const loadMintOMatic = () => import('@/components/MintOMatic')

export function DeferredHomeDegenCarousel() {
  return (
    <DeferredSection
      label="community DEGEN carousel"
      load={loadCommunityDegenCarousel}
      minHeightClassName="min-h-[22rem]"
    />
  )
}

export function DeferredHomeMintOMatic() {
  return (
    <DeferredSection
      label="NFTL mint animation"
      load={loadMintOMatic}
      minHeightClassName="min-h-[28rem]"
    />
  )
}
