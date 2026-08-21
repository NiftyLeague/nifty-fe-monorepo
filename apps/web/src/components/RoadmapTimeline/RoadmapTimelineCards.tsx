'use client'

import { ROADMAP_CARDS } from './constants'
import RoadmapCard from './roadmapCard'

export default function RoadmapTimelineCards() {
  return (
    <>
      {ROADMAP_CARDS.slice(1).map((item) => (
        <RoadmapCard key={item.title.toString()} {...item} />
      ))}
    </>
  )
}
