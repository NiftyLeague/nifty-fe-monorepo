'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadGameSection = () => import('@/components/GameSection')
const loadDegensSection = () => import('@/components/DegensSection')

export function DeferredGameSection() {
  return (
    <DeferredSection
      label="game details"
      load={loadGameSection}
      minHeightClassName="min-h-[34rem]"
    />
  )
}

export function DeferredDegensSection() {
  return (
    <DeferredSection
      label="DEGEN details"
      load={loadDegensSection}
      minHeightClassName="min-h-[22rem]"
    />
  )
}
