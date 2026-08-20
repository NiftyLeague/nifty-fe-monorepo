'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadHomeSections = () => import('@/components/HomeBelowFold')

const loadHomeDegens = () =>
  loadHomeSections().then(({ HomeDegensSection }) => ({ default: HomeDegensSection }))
const loadHomeCompete = () =>
  loadHomeSections().then(({ HomeCompeteSection }) => ({ default: HomeCompeteSection }))
const loadHomeNiftyWorld = () =>
  loadHomeSections().then(({ HomeNiftyWorldSection }) => ({ default: HomeNiftyWorldSection }))
const loadHomeDashboard = () =>
  loadHomeSections().then(({ HomeDashboardSection }) => ({ default: HomeDashboardSection }))
const loadHomeToken = () =>
  loadHomeSections().then(({ HomeTokenSection }) => ({ default: HomeTokenSection }))
const loadHomeCommunity = () =>
  loadHomeSections().then(({ HomeCommunitySection }) => ({ default: HomeCommunitySection }))
const loadHomeSponsors = () =>
  loadHomeSections().then(({ HomeSponsorsSection }) => ({ default: HomeSponsorsSection }))

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

export function DeferredHomeNiftyWorld() {
  return (
    <DeferredSection
      label="NiftyWorld section"
      load={loadHomeNiftyWorld}
      minHeightClassName="min-h-[32rem]"
    />
  )
}

export function DeferredHomeDashboard() {
  return (
    <DeferredSection
      label="dashboard section"
      load={loadHomeDashboard}
      minHeightClassName="min-h-[32rem]"
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

export function DeferredHomeCommunity() {
  return (
    <DeferredSection
      label="community section"
      load={loadHomeCommunity}
      minHeightClassName="min-h-[32rem]"
    />
  )
}

export function DeferredHomeSponsors() {
  return (
    <DeferredSection
      label="sponsors section"
      load={loadHomeSponsors}
      minHeightClassName="min-h-[28rem]"
    />
  )
}
