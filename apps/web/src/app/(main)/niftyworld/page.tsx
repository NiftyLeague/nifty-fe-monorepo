import Image from 'next/image'
import type { NextPage } from 'next'

import { DeferredConsoleGame } from '@nl/ui/custom/deferred-console-game'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'

import { NIFTYWORLD_PROPERTIES } from '@/constants/niftyworld'
import ThemeBtnGroup from '@/components/ThemeBtnGroup'

const NiftyWorld: NextPage = () => {
  return (
    <>
      <section className="relative xl:-top-20 2xl:-top-35">
        <DeferredConsoleGame src="/video/mansion_showcase.mp4" />

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
                src="/video/arcade-token.mp4"
              />
            </div>
          </div>
          <div className="purple-bg-orb orb-top-right" />
        </section>

        <section className="section relative">
          <div className="purple-bg-orb orb-top-left" />
          <div className="mb-3 mb-md-5">
            <h3 className="text-center">PROPERTY TYPES FOR EVERYONE</h3>
          </div>
          <div className="flex flex-col items-start md:flex-row w-full justify-between flex-wrap">
            {NIFTYWORLD_PROPERTIES.map(({ name, description, image }) => (
              <div
                className="w-full md:w-1/2 flex flex-col lg:flex-row relative py-3 px-2 mb-3 md:mb-5"
                key={name}
              >
                <div className="w-full lg:w-1/2 lg:pr-2 flex flex-col">
                  <h6 className="my-0">{name}</h6>
                  <p className="mt-2 md:mt-4 mb-4 lg:mb-0">{description}</p>
                </div>
                <div className="w-full lg:w-1/2 lg:pl-2 relative">
                  <div>
                    <Image
                      src={image}
                      alt="NiftyWorld District Highlight"
                      width={500}
                      height={283}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ThemeBtnGroup
            primary={{
              href: '/docs/overview/games/niftyworld',
              title: 'VIEW DOCS',
              external: true,
            }}
          />
        </section>
      </div>
    </>
  )
}

export default NiftyWorld
