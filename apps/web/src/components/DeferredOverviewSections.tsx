'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadOverviewFAQ = () => import('@/components/OverviewFAQ')

export function DeferredOverviewFAQ() {
  return (
    <DeferredSection
      label="frequently asked questions"
      load={loadOverviewFAQ}
      minHeightClassName="min-h-[24rem]"
      rootMargin="480px"
    />
  )
}
