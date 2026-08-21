import RoadmapCard from './roadmapCard'
import { ROADMAP_CARDS } from './constants'
import DeferredRoadmapCards from './DeferredRoadmapCards'
import styles from './index.module.css'

const RoadmapTimeline = () => {
  const firstCard = ROADMAP_CARDS[0]

  return (
    <section id={styles.cd_timeline} className={styles.cd_container}>
      {firstCard ? <RoadmapCard key={firstCard.title.toString()} {...firstCard} /> : null}
      <DeferredRoadmapCards />
    </section>
  )
}

export default RoadmapTimeline
