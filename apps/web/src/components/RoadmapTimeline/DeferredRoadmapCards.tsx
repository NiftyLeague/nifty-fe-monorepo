import RoadmapTimelineCards from './RoadmapTimelineCards'

/**
 * The remaining roadmap milestones render directly: static HTML keeps the
 * milestones crawlable, media below the fold stays lazy (native loading
 * attributes and the viewport-gated animated-image components), and the
 * placeholder-to-content swap that caused large layout shifts is gone.
 */
export default function DeferredRoadmapCards() {
  return <RoadmapTimelineCards />
}
