import Link from 'next/link'
import { buttonVariants } from '@nl/ui/base/button-variants'
import GameCard from '@/components/cards/GameCard'

import styles from '../grid-item.module.css'

const gameActionClassName = 'w-full min-w-20 flex-1'

const Web3GameList = () => {
  return (
    <>
      <div className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
        <GameCard
          title="2D Smashers"
          externalLink={{ title: 'Smashers Mobile', src: 'https://niftysmashers.com/' }}
          required="DEPRECATED - Please download our mobile app!"
          description="The first NFT brawler on the Ethereum blockchain. Now available free-to-play on all mobile platforms!"
          image="/img/games/smashers/nifty-smashers-poster.webp"
          autoHeight={false}
          actions={
            <Link
              href="/games/smashers"
              className={buttonVariants({ variant: 'outline', className: gameActionClassName })}
            >
              Play in Browser
            </Link>
          }
        />
      </div>
      <div className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
        <GameCard
          title="WEN Game"
          required="Arcade Tokens Required"
          description="Nifty League's first arcade mini-game! This single-player baseball game is sure to test your reflexes."
          image="/img/games/wen-poster-640.webp"
          autoHeight={false}
          actions={
            <Link
              href="/games/wen-game"
              className={buttonVariants({ variant: 'outline', className: gameActionClassName })}
            >
              Play in Browser
            </Link>
          }
        />
      </div>
      <div className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
        <GameCard
          title="Crypto Winter"
          required="Arcade Tokens Required"
          description="Winter is here... Play this single-player dodgeball-inspired arcade game and rank as high as you can!"
          image="/img/games/crypto-winter-640.webp"
          autoHeight={false}
          actions={
            <Link
              href="/games/crypto-winter"
              className={buttonVariants({ variant: 'outline', className: gameActionClassName })}
            >
              Play in Browser
            </Link>
          }
        />
      </div>
      <div className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
        <GameCard
          title="Mt. Gawx"
          required="NFTL required"
          description={`Hearing the DEGENs' desperate pleas to spend their hard-earned NFTL and with bigger sinks still under his development, Satoshi suggests the DEGENs climb to the top of the Mt. Gawx volcano to offer their NFTL sacrifices to the fiery depths to see who might burn the most, and to discover whether the rumors of Rugman offering interesting rewards for burners are true.\n\nStrange thing is, every time they lob in NFTL, it's almost as if the volcano's… responding.\n\nCould the fabled 7th tribe be waking up from their centuries-long slumber, deep in the caves where Rugman resides?`}
          showMore={true}
          image="/img/games/mt-gawx-poster.webp"
          autoHeight={true}
          actions={
            <button
              type="button"
              disabled
              className={buttonVariants({ variant: 'outline', className: gameActionClassName })}
            >
              Mountain Closed
            </button>
          }
        />
      </div>
      <div className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
        <GameCard
          title="Nifty Tennis"
          required="Unreleased"
          description={
            'An early concept of the first Web3 Tennis game. We developed the early prototype to test the waters and see if we could create a fun and engaging game. The game is currently on hold and may be revisited in the future.'
          }
          showMore={true}
          image="/img/games/nifty-tennis-640.webp"
          autoHeight={true}
          actions={
            <button
              type="button"
              disabled
              className={buttonVariants({ variant: 'outline', className: gameActionClassName })}
            >
              Not Available
            </button>
          }
        />
      </div>
    </>
  )
}

export default Web3GameList
