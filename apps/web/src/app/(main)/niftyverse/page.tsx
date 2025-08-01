import Image from 'next/image';
import type { NextPage } from 'next';

import { AnimatedWrapper } from '@nl/ui/custom/AnimatedWrapper';
import ConsoleGame from '@nl/ui/custom/ConsoleGame';

import { NIFTYVERSE_PROPERTIES } from '@/constants/niftyverse';
import ThemeBtnGroup from '@/components/ThemeBtnGroup';

const NiftyVerse: NextPage = () => {
  return (
    <>
      <section className="relative xl:-top-20 2xl:-top-35">
        <ConsoleGame src="/video/mansion_showcase.mp4" />

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
              <AnimatedWrapper>
                <h1 className="transition-vertical-fade transition-vertical-fade-start">NIFTYVERSE</h1>
              </AnimatedWrapper>
            </div>
            <div className="mb-3 mb-md-0">
              <AnimatedWrapper>
                <p className="transition-vertical-fade transition-vertical-fade-start delay-lite">
                  NiftyVerse is a virtual space for gamers to connect, collaborate, and compete with each other. The
                  initial districts are designed by the Nifty League team, but ultimately the vision is for NiftyVerse
                  to be a dynamic and interoperable platform for developers to create their own games, ensuring a wide
                  variety of immersive experiences for players. Do note: all DEGEN holders have been promised free land
                  parcels in the NiftyVerse!
                </p>
              </AnimatedWrapper>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-5/12">
            <AnimatedWrapper>
              <div className="relative text-right transition-fade-slow transition-fade-start delay-normal ps-0 lg:ps-5 mb-3">
                <video width="100%" height="100%" muted autoPlay loop playsInline data-keepplaying>
                  <source src="/video/arcade-token.mp4" type="video/mp4" />
                </video>
              </div>
            </AnimatedWrapper>
          </div>
          <div className="purple-bg-orb orb-top-right" />
        </section>

        <section className="section relative">
          <div className="purple-bg-orb orb-top-left" />
          <div className="mb-3 mb-md-5">
            <AnimatedWrapper>
              <h3 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">
                PROPERTY TYPES FOR EVERYONE
              </h3>
            </AnimatedWrapper>
          </div>
          <div className="flex flex-col items-start md:flex-row w-full justify-between flex-wrap">
            {NIFTYVERSE_PROPERTIES.map(({ name, description, image }) => (
              <div className="w-full md:w-1/2 flex flex-col lg:flex-row relative py-3 px-2 mb-3 md:mb-5" key={name}>
                <div className="w-full lg:w-1/2 lg:pr-2 flex flex-col">
                  <AnimatedWrapper>
                    <h6 className="my-0 transition-fade-slow transition-fade-start delay-lite">{name}</h6>
                  </AnimatedWrapper>
                  <AnimatedWrapper>
                    <p className="mt-2 md:mt-4 mb-4 lg:mb-0 transition-fade-slow transition-fade-start delay-normal">
                      {description}
                    </p>
                  </AnimatedWrapper>
                </div>
                <div className="w-full lg:w-1/2 lg:pl-2 relative">
                  <AnimatedWrapper>
                    <div className="transition-fade transition-fade-start delay-normal">
                      <Image
                        src={image}
                        alt="NiftyVerse District Highlight"
                        width={500}
                        height={283}
                        style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
                      />
                    </div>
                  </AnimatedWrapper>
                </div>
              </div>
            ))}
          </div>
          <ThemeBtnGroup primary={{ href: '/docs/overview/games/niftyverse', title: 'VIEW DOCS', external: true }} />
        </section>
      </div>
    </>
  );
};

export default NiftyVerse;
