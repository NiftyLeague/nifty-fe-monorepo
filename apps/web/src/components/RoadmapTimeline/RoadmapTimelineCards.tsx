'use client'

import { DeferredComponent } from '@nl/ui/custom/deferred-component'
import { DeferredSectionLoading } from '@nl/ui/custom/deferred-section'
import RoadmapCard, { getRoadmapCardSide } from './roadmapCard'

const loadRoadmapCardCatalog = async () => {
  const { ROADMAP_CARDS } = await import('./constants')

  return {
    default: function RoadmapCardCatalog() {
      return (
        <>
          {ROADMAP_CARDS.map((item, index) => (
            <RoadmapCard
              key={item.title.toString()}
              {...item}
              side={getRoadmapCardSide(index + 1)}
            />
          ))}
        </>
      )
    },
  }
}

export default function RoadmapTimelineCards() {
  return (
    <DeferredComponent
      label="Additional roadmap milestones"
      load={loadRoadmapCardCatalog}
      props={{}}
      loadingFallback={
        <DeferredSectionLoading
          label="additional roadmap milestones"
          minHeightClassName="min-h-[1200rem]"
        />
      }
    />
  )
}
