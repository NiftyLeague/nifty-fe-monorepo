import Link from '@/runtime/Link'
import { buttonVariants } from '@nl/ui/base/button-variants'
import GameCard from '@/components/cards/GameCard'
import { NIFTY_WORLD_GAMES } from '@/constants/niftyworld-games'

import styles from '../grid-item.module.css'

const gameActionClassName = 'w-full min-w-20 flex-1'

const Web3GameList = () => (
  <>
    {NIFTY_WORLD_GAMES.map((game) => (
      <div key={game.id} className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
        <GameCard
          title={game.title}
          description={game.description}
          image={game.image}
          autoHeight={false}
          actions={
            <Link
              href={`/games/niftyworld/${game.id}`}
              prefetch={false}
              className={buttonVariants({ variant: 'outline', className: gameActionClassName })}
            >
              Play in App
            </Link>
          }
        />
      </div>
    ))}
  </>
)

export default Web3GameList
