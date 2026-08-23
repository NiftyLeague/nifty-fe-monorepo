'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadHomeDegens = () => import('@/components/HomeSections/HomeDegensSection')
const loadHomeCompete = () => import('@/components/HomeSections/HomeCompeteSection')
const loadHomeToken = () => import('@/components/HomeSections/HomeTokenSection')

export function DeferredHomeDegens() {
  return (
    <DeferredSection
      label="community DEGEN section"
      load={loadHomeDegens}
      minHeightClassName="min-h-[32rem]"
    />
  )
}

export function DeferredHomeCompete() {
  return (
    <DeferredSection
      label="compete and earn section"
      load={loadHomeCompete}
      minHeightClassName="min-h-[36rem]"
    />
  )
}

export function DeferredHomeToken() {
  return (
    <DeferredSection
      label="NFTL token section"
      load={loadHomeToken}
      minHeightClassName="min-h-[32rem]"
    />
  )
}
