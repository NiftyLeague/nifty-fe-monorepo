import { ViewportVideo } from '@nl/ui/custom/viewport-video'
import { MobileOnlyImage } from '@nl/ui/custom/responsive-only-image'

import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'
import GameCard from '@/components/GameCard'
import { NIFTY_GAMES } from '@/constants/games'
import { NIFTY_APP_URL } from '@/constants/links'

const Games = (slots: Record<string, React.ReactNode> = {}) => {
  const [flagship, ...games] = NIFTY_GAMES

  return (
    <>
      <section className="container relative pt-20">
        <div className="purple-bg-orb orb-top-right" />
        <div className="section flex flex-col-reverse md:flex-row items-center justify-center">
          <div className="flex flex-col w-full md:w-1/2 lg:w-7/12 pr-0 md:pr-3 text-center md:text-left">
            <p className="mb-3 font-special text-[0.625rem] leading-[1.9] tracking-[0.02em] uppercase text-highlight-purple">
              PICK YOUR NEXT ADVENTURE
            </p>
            <h1 className="m-0">GAMES</h1>
            <p className="mt-4 mb-0">
              Jump into Nifty League&apos;s growing lineup of browser games, mini-games, and social
              worlds. Everything is waiting for you in the app.
            </p>
            <ThemeBtnGroup
              className="justify-center md:justify-start"
              primary={{ href: NIFTY_APP_URL, title: 'PLAY NOW', external: true }}
            />
          </div>

          <div className="w-full md:w-1/2 lg:w-5/12">
            <div className="animate-zoom-out">
              {slots.webIsland0 ?? (
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
              )}
              <div className="block md:hidden">
                <MobileOnlyImage
                  alt="Arcade"
                  width={339}
                  height={661}
                  loading="eager"
                  src="/img/games/smashers/arcade.webp"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container relative">
        <div className="purple-bg-orb orb-top-right" />
        <section aria-labelledby="games-lineup-heading" className="section">
          <div className="mb-4 text-center">
            <p className="mb-3 font-special text-[0.625rem] leading-[1.9] tracking-[0.02em] uppercase text-highlight-purple">
              THE LINEUP
            </p>
            <h2 id="games-lineup-heading" className="m-0">
              PLAY TOGETHER.
            </h2>
          </div>

          {flagship ? <GameCard game={flagship} index={0} highlight /> : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-8">
            {games.map((game, index) => (
              <GameCard key={game.name} game={game} index={index + 1} compact />
            ))}
          </div>

          <ThemeBtnGroup
            className="mt-6 xl:mt-8"
            primary={{ href: NIFTY_APP_URL, title: 'PLAY NOW', external: true }}
          />
        </section>
      </div>
    </>
  )
}

export default Games
