'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadDegenSpecialsTable = () => import('@nl/ui/custom/degen-specials-table')

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
