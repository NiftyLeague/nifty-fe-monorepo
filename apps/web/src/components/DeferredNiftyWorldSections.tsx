'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadNiftyWorldProperties = () => import('@/components/NiftyWorldProperties')

export function DeferredNiftyWorldProperties() {
  return (
    <DeferredSection
      label="NiftyWorld property types"
      load={loadNiftyWorldProperties}
      minHeightClassName="min-h-[240rem] md:min-h-[120rem]"
      rootMargin="240px"
    />
  )
}
