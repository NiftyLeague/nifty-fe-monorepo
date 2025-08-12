import RoadmapCard from './roadmapCard';
import { ROADMAP_CARDS } from './constants';
import styles from './index.module.css';

const RoadmapTimeline = () => {
  return (
    <section id={styles.cd_timeline} className={styles.cd_container}>
      {ROADMAP_CARDS.map(item => (
        <RoadmapCard key={item?.title?.toString()} {...item} />
      ))}
    </section>
  );
};

export default RoadmapTimeline;
