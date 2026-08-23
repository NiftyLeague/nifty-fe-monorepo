import RoadmapCard from './roadmapCard'
import DeferredRoadmapCards from './DeferredRoadmapCards'
import { FIRST_ROADMAP_CARD } from './first-card'
import styles from './index.module.css'

const RoadmapTimeline = () => {
  return (
    <section id={styles.cd_timeline} className={styles.cd_container}>
      <RoadmapCard key={FIRST_ROADMAP_CARD.title} {...FIRST_ROADMAP_CARD} />
      <DeferredRoadmapCards />
    </section>
  )
}

export default RoadmapTimeline
