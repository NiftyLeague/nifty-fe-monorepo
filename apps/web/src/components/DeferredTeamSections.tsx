'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadTeamCarousel = () => import('@/components/TeamCarousel')
const loadTeamDesktop = () => import('@/components/TeamDesktop')

export function DeferredTeamDesktop() {
  return (
    <DeferredSection
      label="desktop team members"
      load={loadTeamDesktop}
      minHeightClassName="min-h-[110rem]"
      rootMargin="0px 0px -160px 0px"
    />
  )
}

export function DeferredTeamCarousel() {
  return (
    <DeferredSection
      label="mobile team carousel"
      load={loadTeamCarousel}
      minHeightClassName="min-h-[300px]"
    />
  )
}
