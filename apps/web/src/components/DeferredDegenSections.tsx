'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadDegenSpecialsTable = () => import('@nl/ui/custom/degen-specials-table')
const loadDegenGallery = () => import('@/components/DegenGallery')

export function DeferredDegenGallery() {
  return (
    <DeferredSection
      label="DEGEN gallery"
      load={loadDegenGallery}
      minHeightClassName="min-h-[52rem] md:min-h-[34rem]"
      rootMargin="0px 0px -160px 0px"
    />
  )
}

export function DeferredDegenSpecialsTable() {
  return (
    <DeferredSection
      label="DEGEN tribe specials"
      load={loadDegenSpecialsTable}
      minHeightClassName="min-h-[70rem]"
      rootMargin="480px"
    />
  )
}
