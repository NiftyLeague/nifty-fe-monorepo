'use client'

import RoadmapCard, { getRoadmapCardSide } from './roadmapCard'
import { ROADMAP_CARDS } from './constants'

export default function RoadmapTimelineCards() {
  return (
    <>
      {ROADMAP_CARDS.map((item, index) => (
        <RoadmapCard key={item.title.toString()} {...item} side={getRoadmapCardSide(index + 1)} />
      ))}
    </>
  )
}
