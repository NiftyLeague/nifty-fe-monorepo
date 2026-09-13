import GameCard from '@/components/cards/GameCard'
import { NIFTY_WORLD_SCENES } from '@/constants/niftyworld-scenes'

import styles from '../games/grid-item.module.css'

const WorldSceneList = () => (
  <>
    {NIFTY_WORLD_SCENES.map((scene) => (
      <div key={scene.id} className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
        <GameCard
          title={scene.title}
          description={scene.description}
          image={scene.image}
          href={`/world/niftyworld/${scene.id}`}
          autoHeight
          overlayContent
          prefetch={false}
        />
      </div>
    ))}
  </>
)

export default WorldSceneList
