import RoadmapCard, { getRoadmapCardSide } from './roadmapCard'
import { ROADMAP_CARDS } from './constants'

export default function RoadmapTimelineCards() {
  return (
    <>
      {ROADMAP_CARDS.map((item, index) => (
        <RoadmapCard {...item} side={getRoadmapCardSide(index + 1)} />
      ))}
    </>
  )
}
