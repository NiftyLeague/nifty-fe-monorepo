'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadOverviewFAQ = () => import('@/components/OverviewFAQ')
const loadOverviewCommunity = () => import('@/components/OverviewCommunity')

export function DeferredOverviewCommunity() {
  return (
    <DeferredSection
      label="overview community section"
      load={loadOverviewCommunity}
      minHeightClassName="min-h-[52rem] md:min-h-[48rem]"
      rootMargin="0px 0px -160px 0px"
    />
  )
}

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
