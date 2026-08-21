'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadRoadmapCards = () => import('./RoadmapTimelineCards')

export default function DeferredRoadmapCards() {
  return (
    <DeferredSection
      label="remaining roadmap milestones"
      load={loadRoadmapCards}
      minHeightClassName="min-h-[1200rem]"
    />
  )
}
