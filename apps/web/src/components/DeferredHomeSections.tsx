'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadMintOMatic = () => import('@/components/MintOMatic')
const loadSponsors = () => import('@/components/Sponsors')
const loadCommunityDegenCarousel = () => import('@/components/CommunityDegenCarousel')

export function DeferredMintOMatic() {
  return (
    <DeferredSection
      label="NFTL mint animation"
      load={loadMintOMatic}
      minHeightClassName="min-h-[28rem]"
    />
  )
}

export function DeferredSponsors() {
  return <DeferredSection label="sponsors" load={loadSponsors} minHeightClassName="min-h-[22rem]" />
}

export function DeferredCommunityDegenCarousel() {
  return (
    <DeferredSection
      label="community DEGEN carousel"
      load={loadCommunityDegenCarousel}
      minHeightClassName="min-h-[22rem]"
    />
  )
}
