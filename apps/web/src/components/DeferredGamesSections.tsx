'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadGamesBelowFold = () => import('@/components/GamesBelowFoldCards')

export function DeferredGamesBelowFold() {
  return (
    <DeferredSection
      label="remaining games"
      load={loadGamesBelowFold}
      minHeightClassName="min-h-[175rem] md:min-h-[125rem]"
      rootMargin="0px 0px -160px 0px"
    />
  )
}
