import type { NextPage } from 'next';
import Image from 'next/image';

import RoadmapTimeline from '@/components/RoadmapTimeline';
import roadmapStyles from '@/components/RoadmapTimeline/index.module.css';
import satoshiStyles from './satoshi-right.module.css';

const Roadmap: NextPage = () => {
  return (
    <div className={roadmapStyles.roadmap_pg}>
      <div className={roadmapStyles.stars}>
        <div className={roadmapStyles.stars2}>
          <div className={satoshiStyles.satoshiMove}>
            <Image
              src="/img/space/satoshi_move.gif"
              unoptimized
              alt="satoshi moving"
              width={200}
              height={200}
              priority
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className={roadmapStyles.earth} />
          <h2 className={roadmapStyles.roadmap_title}>Nifty League Moonmap</h2>
          <div className={roadmapStyles.cat_planet} />
          <div className={roadmapStyles.animated_star} />
          <div className={roadmapStyles.animated_star2} />
          <div className={roadmapStyles.animated_star3} />
          <div className={roadmapStyles.animated_star4} />
          <div className={roadmapStyles.animated_star5} />
          <div className={roadmapStyles.animated_star6} />
          <RoadmapTimeline />
          <div className={roadmapStyles.mars} />
          <div className={roadmapStyles.animated_star7} />
          <div className={roadmapStyles.animated_star8} />
          <div className={roadmapStyles.animated_star9} />
          <div className="w-100 d-flex justify-content-center">
            <div className={roadmapStyles.moon}>
              <Image
                src="/img/space/moon.webp"
                alt="moon"
                width={800}
                height={800}
                priority
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
