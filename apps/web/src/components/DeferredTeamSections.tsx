'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadTeamCarousel = () => import('@/components/TeamCarousel')

export function DeferredTeamCarousel() {
  return (
    <DeferredSection
      label="mobile team carousel"
      load={loadTeamCarousel}
      minHeightClassName="min-h-[300px]"
    />
  )
}
