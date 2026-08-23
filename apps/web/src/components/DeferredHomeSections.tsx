'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadHomeDegens = () => import('@/components/HomeSections/HomeDegensSection')
const loadHomeCompete = () => import('@/components/HomeSections/HomeCompeteSection')
const loadHomeNiftyWorld = () => import('@/components/HomeSections/HomeNiftyWorldSection')
const loadHomeDashboard = () => import('@/components/HomeSections/HomeDashboardSection')
const loadHomeToken = () => import('@/components/HomeSections/HomeTokenSection')
const loadHomeCommunity = () => import('@/components/HomeSections/HomeCommunitySection')
const loadHomeSponsors = () => import('@/components/HomeSections/HomeSponsorsSection')

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
