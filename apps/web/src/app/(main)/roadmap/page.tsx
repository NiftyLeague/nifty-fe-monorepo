import type { NextPage } from 'next'

import OptimizedImage from '@nl/ui/custom/optimized-image'

import RoadmapTimeline from '@/components/RoadmapTimeline'
import roadmapStyles from '@/components/RoadmapTimeline/index.module.css'
import satoshiStyles from './satoshi-right.module.css'

const Roadmap: NextPage = () => {
  return (
    <div className={roadmapStyles.roadmap_pg}>
      <div className={roadmapStyles.stars}>
        <div className={roadmapStyles.stars2}>
          <div className={satoshiStyles.satoshiMove}>
            <OptimizedImage
              src="/img/space/satoshi_move.gif"
              unoptimized
              alt="satoshi moving"
              width={200}
              height={200}
              priority
              sizes="(min-width: 1170px) 250px, (min-width: 1000px) 200px, (min-width: 850px) 175px, 120px"
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
          <div className="w-full flex justify-center">
            <div className={roadmapStyles.moon}>
              <OptimizedImage
                src="/img/space/moon.webp"
                alt="moon"
                width={800}
                height={800}
                sizes="(min-width: 920px) 800px, 600px"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Roadmap
