import type { NextPage } from 'next'

import { ViewportVideo } from '@nl/ui/custom/viewport-video'
import { MobileOnlyImage } from '@nl/ui/custom/responsive-only-image'

import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'
import GameCard from '@/components/GameCard'
import { DeferredGamesBelowFold } from '@/components/DeferredGamesSections'
import { NIFTY_GAMES } from '@/constants/games'

const Games: NextPage = () => {
  const firstGame = NIFTY_GAMES[0]

  return (
    <div className="container relative pt-20">
      <div className="purple-bg-orb orb-top-right" />
      <section className="section flex items-center justify-center flex-wrap">
        <div className="w-1/3 md:w-1/2 md:px-2 lg:px-3">
          <div className="animate-zoom-out">
            <ViewportVideo
              id="lobby"
              width="100%"
              height="100%"
              muted
              loop
              playsInline
              data-keepplaying
              className="hidden md:block"
              deferLoad
              poster="/img/games/smashers/lobby.webp"
              src="/video/lobby.mp4"
            />
            <div className="block md:hidden">
              <MobileOnlyImage
                alt="Arcade"
                width={339}
                height={661}
                loading="eager"
                src="/img/games/smashers/arcade.webp"
                sizes="33vw"
                style={{ width: '100%', height: 'auto', marginBottom: '6rem' }}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 px-2 lg:px-3">
          <div className="mb-4">
            <h1 className="text-center whitespace-nowrap">GAMES</h1>
          </div>
          <div className="mb-5">
            <p className="text-center">
              Join thousands of players around the world competing for the top spot in Nifty
              League!{' '}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        {firstGame ? <GameCard game={firstGame} index={0} /> : null}
        <DeferredGamesBelowFold />

        <ThemeBtnGroup
          className="mt-6 xl:mt-8"
          primary={{
            href: '/docs/guides/nifty-smashers/general-info',
            title: 'VIEW DOCS',
            external: true,
          }}
        />
      </section>
    </div>
  )
}

export default Games
