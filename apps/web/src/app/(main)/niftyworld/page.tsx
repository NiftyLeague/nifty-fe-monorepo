import type { NextPage } from 'next'

import { DeferredConsoleGame } from '@nl/ui/custom/deferred-console-game'
import { ConsoleGameBackdrop } from '@nl/ui/custom/console-game-backdrop'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'

import NiftyWorldProperties from '@/components/NiftyWorldProperties'
import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'

const NiftyWorld: NextPage = () => {
  return (
    <>
      <section className="relative xl:-top-20 2xl:-top-35">
        <DeferredConsoleGame deferVideo src="/video/mansion_showcase.mp4">
          <ConsoleGameBackdrop loading="eager" />
        </DeferredConsoleGame>

        <ThemeBtnGroup
          className="absolute bottom-0 sm:bottom-4"
          primary={{ title: 'COMING SOON', disabled: true }}
          secondary={{
            href: 'https://twitter.com/search?q=%23NiftyLeaks&src=typed_query',
            title: 'VIEW MORE',
            external: true,
          }}
        />
      </section>

      <div className="container relative">
        <section className="section flex flex-col-reverse md:flex-row items-center justify-center">
          <div className="flex flex-col w-full md:w-1/2 lg:w-7/12 pr-0 md:pr-3 text-center md:text-left">
            <div className="mb-2 mb-md-3">
              <h1>NIFTYWORLD</h1>
            </div>
            <div className="mb-3 mb-md-0">
              <p>
                NiftyWorld is a virtual space for gamers to connect, collaborate, and compete with
                each other. The initial districts are designed by the Nifty League team, but
                ultimately the vision is for NiftyWorld to be a dynamic and interoperable platform
                for developers to create their own games, ensuring a wide variety of immersive
                experiences for players. Do note: all DEGEN holders have been promised free land
                parcels in NiftyWorld!
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-5/12">
            <div className="relative text-right ps-0 lg:ps-5 mb-3">
              <ViewportVideo
                width="100%"
                height="100%"
                muted
                loop
                playsInline
                data-keepplaying
                deferLoad
                poster="/img/games/video-posters/nifty-royale.webp"
                src="/video/arcade-token.mp4"
              />
            </div>
          </div>
          <div className="purple-bg-orb orb-top-right" />
        </section>

        <NiftyWorldProperties />
      </div>
    </>
  )
}

export default NiftyWorld
