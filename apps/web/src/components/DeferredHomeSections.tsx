'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

// Keep the first below-fold chunk close enough for a smooth scroll handoff
// without pulling marketing sections into the initial mobile load.
const HOME_SECTION_ROOT_MARGIN = '240px 0px'

const loadHomeDegens = () => import('@/components/HomeSections/HomeDegensSection')
const loadHomeCompete = () => import('@/components/HomeSections/HomeCompeteSection')
const loadHomeNiftyWorld = () => import('@/components/HomeSections/HomeNiftyWorldSection')
const loadHomeDashboard = () => import('@/components/HomeSections/HomeDashboardSection')
const loadHomeToken = () => import('@/components/HomeSections/HomeTokenSection')
const loadHomeCommunity = () => import('@/components/HomeSections/HomeCommunitySection')
const loadHomeSponsors = () => import('@/components/HomeSections/HomeSponsorsSection')

const HOME_SECTION_LOADING = {
  degen: 'min-h-[32rem]',
  compete: 'min-h-[36rem]',
  niftyWorld: 'min-h-[32rem]',
  dashboard: 'min-h-[40rem] md:min-h-[56rem]',
  token: 'min-h-[32rem]',
  community: 'min-h-[36rem]',
  sponsors: 'min-h-[32rem]',
} as const

function DeferredHomeSection({
  label,
  load,
  minHeightClassName,
}: {
  label: string
  load: () => Promise<{ default: React.ComponentType }>
  minHeightClassName: string
}) {
  return (
    <DeferredSection
      label={label}
      load={load}
      minHeightClassName={minHeightClassName}
      rootMargin={HOME_SECTION_ROOT_MARGIN}
      loadingMode="minimal"
    />
  )
}

export function DeferredHomeDegens() {
  return (
    <DeferredHomeSection
      label="community DEGEN section"
      load={loadHomeDegens}
      minHeightClassName={HOME_SECTION_LOADING.degen}
    />
  )
}

export function DeferredHomeCompete() {
  return (
    <DeferredHomeSection
      label="compete and earn section"
      load={loadHomeCompete}
      minHeightClassName={HOME_SECTION_LOADING.compete}
    />
  )
}

export function DeferredHomeNiftyWorld() {
  return (
    <DeferredHomeSection
      label="NiftyWorld section"
      load={loadHomeNiftyWorld}
      minHeightClassName={HOME_SECTION_LOADING.niftyWorld}
    />
  )
}

export function DeferredHomeDashboard() {
  return (
    <DeferredHomeSection
      label="dashboard section"
      load={loadHomeDashboard}
      minHeightClassName={HOME_SECTION_LOADING.dashboard}
    />
  )
}

export function DeferredHomeToken() {
  return (
    <DeferredHomeSection
      label="NFTL token section"
      load={loadHomeToken}
      minHeightClassName={HOME_SECTION_LOADING.token}
    />
  )
}

export function DeferredHomeCommunity() {
  return (
    <DeferredHomeSection
      label="community section"
      load={loadHomeCommunity}
      minHeightClassName={HOME_SECTION_LOADING.community}
    />
  )
}

export function DeferredHomeSponsors() {
  return (
    <DeferredHomeSection
      label="sponsors section"
      load={loadHomeSponsors}
      minHeightClassName={HOME_SECTION_LOADING.sponsors}
    />
  )
}
