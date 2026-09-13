import { buttonVariants } from '@nl/ui/base/button-variants'

import GameCard from '@/components/cards/GameCard'
import Link from '@/runtime/Link'
import { NIFTY_WORLD_SCENES } from '@/constants/niftyworld-scenes'

import styles from '../games/grid-item.module.css'

const sceneActionClassName = 'w-full min-w-20 flex-1'

const WorldSceneList = () => (
  <>
    {NIFTY_WORLD_SCENES.map((scene) => (
      <div key={scene.id} className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
        <GameCard
          title={scene.title}
          description={scene.description}
          image={scene.image}
          autoHeight={false}
          actions={
            <Link
              href={`/world/niftyworld/${scene.id}`}
              prefetch={false}
              className={buttonVariants({ variant: 'outline', className: sceneActionClassName })}
            >
              Enter World
            </Link>
          }
        />
      </div>
    ))}
  </>
)

export default WorldSceneList
