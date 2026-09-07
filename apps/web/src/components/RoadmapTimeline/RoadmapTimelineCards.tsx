'use client'

import RoadmapCard, { getRoadmapCardSide } from './roadmapCard'
import { ROADMAP_CARDS } from './constants'

const loadRoadmapCardCatalog = async () => {
  const { ROADMAP_CARDS } = await import('./constants')

  return {
    default: function RoadmapCardCatalog() {
      return (
        <>
          {ROADMAP_CARDS.map((item) => (
            <RoadmapCard key={item.title.toString()} {...item} />
          ))}
        </>
      )
    },
  }
}

export default function RoadmapTimelineCards() {
  return (
    <>
      {ROADMAP_CARDS.map((item, index) => (
        <RoadmapCard key={item.title.toString()} {...item} side={getRoadmapCardSide(index + 1)} />
      ))}
    </>
  )
}
