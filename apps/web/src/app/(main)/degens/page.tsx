'use client';

import type { NextPage } from 'next';
import Image from 'next/image';

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery';
import { AnimatedWrapper } from '@nl/ui/custom/AnimatedWrapper';
import ConsoleGame from '@nl/ui/custom/ConsoleGame';
import DegenSpecialsTable from '@nl/ui/custom/DegenSpecialsTable';
import { cn } from '@nl/ui/utils';

import { NIFTY_DEGENS_ALL } from '@/constants/degens';
import ThemeBtnGroup from '@/components/ThemeBtnGroup';
import styles from './index.module.css';

const Degens: NextPage = () => {
  const desktop = useMediaQuery('(min-width:769px)');
  return (
    <>
      <section className="relative xl:-top-20 2xl:-top-35">
        <ConsoleGame src="/video/unboxing.mp4" />
      </section>

      <div className="container">
        <section className="section">
          <div className="flex items-center justify-center flex-wrap mb-4 md:mb-5">
            <div className="w-full md:w-1/2 md:pr-4">
              <div className="mb-4">
                <AnimatedWrapper>
                  <h1 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">
                    DEGENs
                  </h1>
                </AnimatedWrapper>
              </div>
              <div className="mb-4">
                <AnimatedWrapper>
                  <h6 className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
                    COMMUNITY DESIGNED NFTs
                  </h6>
                </AnimatedWrapper>
              </div>
              <div className="relative">
                <AnimatedWrapper>
                  <p className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
                    The Nifty League DEGENs were specially crafted by the community with members pitching in and
                    deciding how THEY wanted their DEGENs to look. This involved selecting special features that they
                    wanted including selection of cothing, tribe, and weapons among a few others. This led to the birth
                    of 10,000 Nifty League NFTs on the Ethereum blockchain. The NFTs are all sold out however they are
                    forever tradable on secondary markets such as OpenSea.
                  </p>
                </AnimatedWrapper>
                <div className="purple-bg-orb orb-top-left" />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <AnimatedWrapper>
                <div className="relative text-right transition-fade-slow transition-fade-start delay-normal mb-4 md:mb-0 ps-0 lg:pl-5">
                  <iframe
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/WWLqE1tnf6U"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </AnimatedWrapper>
            </div>
          </div>

          <ThemeBtnGroup
            className="mt-6 xl:mt-10"
            primary={{ href: 'https://app.niftyleague.com/degens', title: 'SEE ALL DEGENS', external: true }}
          />
        </section>

        <section className="section relative">
          <div className="purple-bg-orb orb-bottom-right" />
          <div className={cn(styles.list, 'flex flex-wrap items-center md:flex-row w-full justify-between')}>
            {NIFTY_DEGENS_ALL.map(({ name, image }) => (
              <div className="flex flex-col mb-3 px-3 w-1/3" key={name}>
                <AnimatedWrapper>
                  <div className="transition-fade-slow transition-fade-start delay-lite">
                    <Image
                      src={image.link}
                      alt={name}
                      width={desktop ? image.width : image.width / 2}
                      height={desktop ? image.height : image.height / 2}
                      className="mx-auto"
                    />
                  </div>
                </AnimatedWrapper>
                <AnimatedWrapper>
                  <h6 className="mx-auto text-center mt-3 transition-fade-slow transition-fade-start delay-lite">
                    {name}
                  </h6>
                </AnimatedWrapper>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="mb-10 max-w-3xl mx-auto">
            <div className="mb-5">
              <AnimatedWrapper>
                <h2 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">
                  DEGEN TRIBES
                </h2>
              </AnimatedWrapper>
            </div>
            <div className="relative">
              <AnimatedWrapper>
                <p className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
                  There are 7 genesis DEGEN tribes each with their own special abilities in our games. These NFTs are
                  digital assets that represent special game avatars inside the Nifty League ecosystem. Owners can also
                  use their DEGEN NFTs in several other partner projects such as WORLDWIDE WEBB or CRYPTO FOXES.
                </p>
              </AnimatedWrapper>
              <div className="purple-bg-orb orb-top-left" />
            </div>
          </div>

          <DegenSpecialsTable />

          <ThemeBtnGroup
            className="mt-6 xl:mt-8"
            primary={{ href: '/docs/overview/nfts/degens/about', title: 'VIEW DOCS', external: true }}
          />
        </section>
      </div>
    </>
  );
};

export default Degens;
