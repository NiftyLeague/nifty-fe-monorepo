import RoadmapCard, { getRoadmapCardSide } from './roadmapCard'
import DeferredRoadmapCards from './DeferredRoadmapCards'
import { FIRST_ROADMAP_CARD } from './first-card'
import styles from './index.module.css'

const RoadmapTimeline = () => {
  return (
    <section id={styles.cd_timeline} class={styles.cd_container}>
      <RoadmapCard {...FIRST_ROADMAP_CARD} side={getRoadmapCardSide(0)} />
      <DeferredRoadmapCards />
    </section>
  )
}

export default RoadmapTimeline
