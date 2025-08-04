'use client';

import { useRef } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery';
import { AnimatedWrapper } from '@nl/ui/custom/animated-wrapper';
import { ConsoleGame } from '@nl/ui/custom/console-game';

import BouncingNFTL from '@/components/BouncingNFTL';
import Carousel from '@/components/Carousel';
import MainLayout from '@/components/MainLayout';
import MintOMatic from '@/components/MintOMatic';
import Sponsors from '@/components/Sponsors';
import ThemeBtnGroup from '@/components/ThemeBtnGroup';
import { RenderDegen } from '@/components/Carousel/DegenCardItem';
import { COMMUNITY_DEGEN_LIST, DEGEN_COLLECTION_URL } from '@/constants/degens';
import { SPONSORS } from '@/constants/sponsors';

import '@/styles/home.css';

const DesktopIntro = ({ scrollToGamingSection }: { scrollToGamingSection: () => void }) => {
  return (
    <section className="desktop relative w-screen max-h-screen overflow-hidden">
      <div>
        <div className="relative flex-grow home-banner animate-zoom-out">
          <Image
            src="/img/hero/bg.webp"
            alt="Nifty Home Banner"
            width={1920}
            height={1042}
            priority
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
        <AnimatedWrapper>
          <div className="absolute home-hero-characters-image flex-grow animate-zoom-out-large">
            <Image
              src="/img/hero/characters.webp"
              alt="Nifty Hero Characters"
              width={1920}
              height={1042}
              priority
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>
        </AnimatedWrapper>
        <div className="home-hero-companion">
          <div className="relative flex-grow">
            <AnimatedWrapper>
              <div className="animate-hover transition-fade-start transition-fade delay-extreme">
                <Image
                  src="/img/hero/companion-base.webp"
                  alt="Home Hero Companion Base"
                  width={175}
                  height={175}
                  className="pixelated w-full h-auto"
                  sizes="100vw"
                />
                <div className="absolute home-hero-companion-swing animate-propeller" />
              </div>
            </AnimatedWrapper>
          </div>
        </div>
        <div className="home-hero-halo">
          <div className="flex-grow">
            <AnimatedWrapper>
              <div className="animate-hover transition-fade-start transition-fade delay-extreme-offset">
                <Image
                  src="/img/hero/halo.webp"
                  alt="Home Hero Halo"
                  width={133}
                  height={50}
                  sizes="100vw"
                  className="w-full h-auto"
                />
              </div>
            </AnimatedWrapper>
          </div>
        </div>
        <div className="dark-gradient-overlay" />
      </div>

      <div className="home-satoshi-container">
        <AnimatedWrapper>
          <div className="relative flex-grow home-satoshi transition-quick-pop-left transition-quick-pop-left-start delay-normal">
            <Image
              alt="Satoshi"
              src="/img/hero/satoshi.webp"
              priority
              width={180}
              height={190}
              sizes="100vw"
              className="object-cover w-full h-auto"
            />
          </div>
        </AnimatedWrapper>
      </div>

      <div className="flex flex-col mt-auto home-content">
        <AnimatedWrapper>
          <h1 className="home-content-title transition-vertical-fade transition-vertical-fade-start">
            WELCOME TO <br />
            NIFTY LEAGUE
          </h1>
        </AnimatedWrapper>
        <div className="my-2 lg:my-4">
          <AnimatedWrapper>
            <p className="home-content-description transition-vertical-fade transition-vertical-fade-start delay-lite">
              <span className="whitespace-nowrap">DECENTRALIZED GAME STUDIO & PUBLISHER.</span>
              <br />
              <span className="whitespace-nowrap">BY GAMERS, FOR GAMERS.</span>
            </p>
          </AnimatedWrapper>
        </div>
        <AnimatedWrapper>
          <div
            className="inline-block relative flex-grow satoshi-learn-more transition-fade-slow transition-fade-start delay-long"
            onClick={scrollToGamingSection}
          >
            <Image
              src="/img/hero/speech-bubble.webp"
              alt="Learn More"
              width={348}
              height={108}
              sizes="100vw"
              className="w-full h-auto"
            />
            <p className="m-0 p-0 speech-bubble-text">Learn More!</p>
          </div>
        </AnimatedWrapper>
      </div>
    </section>
  );
};

const MobileIntro = () => {
  return (
    <section className="mobile m-0 p-0 relative pt-5 home-mobile-intro">
      <div className="overlay-dark min-h-screen" />
      <div className="dark-gradient-overlay" />
      <div className="w-full relative min-h-screen flex flex-col justify-center text-center items-center">
        <h1 className="mt-0 sm:mt-4 md:mt-5">Nifty League</h1>
        <h5 className="mt-2 [word-spacing:-10px]">By Gamers. For Gamers.</h5>
        <p className="my-4 text-center whitespace-nowrap">Community-Governed Game Studio</p>
        <ThemeBtnGroup
          className="mt-2 xl:mt-2 mb-2"
          primary={{ href: 'https://app.niftyleague.com', title: 'PLAY NOW', external: true }}
        />
        <div className="flex items-center mt-3 mb-5">
          <a className="pr-4" href="https://discord.gg/niftyleague" target="_blank" rel="noreferrer">
            <Image src="/icons/socials/discord.svg" alt="Discord Logo" width={26} height={22} />
          </a>
          <a className="pr-4" href="https://twitter.com/NiftyLeague" target="_blank" rel="noreferrer">
            <Image src="/icons/socials/twitter.svg" alt="Twitter Logo" width={26} height={22} />
          </a>
          <a className="pr-4" href={DEGEN_COLLECTION_URL} target="_blank" rel="noreferrer">
            <Image src="/icons/opensea.svg" alt="OpenSea Logo" width={24} height={22} />
          </a>
          <a href="https://www.twitch.tv/niftyleagueofficial" target="_blank" rel="noreferrer">
            <Image src="/icons/socials/twitch.svg" alt="Twitch Logo" width={24} height={22} />
          </a>
        </div>
      </div>
    </section>
  );
};

const Home: NextPage = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
  const gamingSectionRef = useRef<HTMLDivElement>(null);

  const scrollToGamingSection = () => {
    if (!gamingSectionRef.current) return;
    (gamingSectionRef.current as HTMLDivElement).scrollIntoView();
  };

  return (
    <MainLayout classes={{ root: 'home-pg' }}>
      <MobileIntro />
      <DesktopIntro scrollToGamingSection={scrollToGamingSection} />

      {/* SMASHERS */}
      <section className="w-screen relative text-center" ref={gamingSectionRef}>
        <AnimatedWrapper>
          <h2 className="absolute w-full z-10 -mt-4 sm:mt-8 md:mt-16 lg:mt-22 transition-vertical-fade transition-vertical-fade-start">
            CLASSIC GAMING REINVENTED
          </h2>
        </AnimatedWrapper>

        <ConsoleGame src="/video/smashers.mp4" />

        <ThemeBtnGroup
          className="absolute bottom-0 sm:bottom-4"
          primary={{ href: 'https://niftysmashers.com', title: 'SMASHERS', external: true }}
          secondary={{ href: '/games', title: 'MORE GAMES' }}
        />
      </section>

      {/* DEGENS */}
      <section className="section w-screen relative flex flex-col text-center sliding-nfts">
        <AnimatedWrapper>
          <h2 className="my-3 lg:my-5 px-5 sm:px-8 transition-vertical-fade transition-vertical-fade-start">
            {isMobile ? 'OWN YOUR AVATAR' : 'COMMUNITY-GENERATED AVATARS'}
          </h2>
        </AnimatedWrapper>

        <div className="relative pt-16 pb-8 px-0 mx-0 mb-12">
          <div className="absolute inset-0 mt-20 flex items-center justify-center z-10 pointer-events-none">
            <Image
              className="pixelated w-full h-auto max-w-[90vw] md:max-w-[80%] lg:max-w-[700px] xl:max-w-[800px]"
              src="/img/degens/nifty-ape.webp"
              width={800}
              height={788}
              alt="ape degen overlay"
              sizes="(max-width: 576px) 90vw, (max-width: 992px) 80%, 700px"
            />
          </div>
          <Carousel mobileItems={2}>{COMMUNITY_DEGEN_LIST.map(RenderDegen)}</Carousel>
        </div>
      </section>

      {/* COMPETE & EARN */}
      <section className="container section relative flex items-center">
        <div className="w-full md:w-1/2 flex flex-col relative">
          <div className="purple-bg-orb orb-top-left" />
          <div className="block md:hidden relative w-full">
            <AnimatedWrapper>
              <div className="transition-quick-pop transition-quick-pop-start delay-lite">
                <Image
                  src="/img/compete-and-earn/mobile.webp"
                  alt="Compete and Earn"
                  width={655}
                  height={275}
                  sizes="100vw"
                  className="w-full h-auto"
                />
              </div>
            </AnimatedWrapper>
          </div>

          <div className="hidden md:block relative">
            <BouncingNFTL classes={{ token3: 'hidden' }} />
          </div>

          <div className="relative flex flex-col items-center md:items-start">
            <AnimatedWrapper>
              <h2 className="mb-3 max-w-[400px] section-heading transition-vertical-fade transition-vertical-fade-start delay-lite">
                SMASHERS
                <br />
                <span className="whitespace-nowrap font-default font-normal">COMPETE & EARN</span>
              </h2>
            </AnimatedWrapper>
            <AnimatedWrapper>
              <p className="my-0 py-1 md:py-3 section-description transition-vertical-fade transition-vertical-fade-start delay-normal">
                4 - 16 PLAYERS COMPETE IN A CUT-THROAT BATTLE FOR THE SURVIVAL OF THE FITTEST!
              </p>
            </AnimatedWrapper>
            <ThemeBtnGroup
              className="md:justify-start"
              primary={{
                href: 'https://niftysmashers.com',
                title: isMobile ? 'BRAWL!' : "LET'S BRAWL!",
                external: true,
              }}
              secondary={{ href: '/compete-and-earn', title: 'LEARN MORE' }}
            />
          </div>
        </div>

        <div className="hidden md:block w-1/2 relative">
          <AnimatedWrapper>
            <div className="transition-quick-pop transition-quick-pop-start delay-normal">
              <Image
                src="/img/compete-and-earn/animated/competitors.webp"
                alt="Compete and Earn"
                width={668}
                height={535}
                sizes="100vw"
                className="w-full h-auto"
              />
            </div>
          </AnimatedWrapper>
          <div className="absolute scrolling-nftl-token">
            <AnimatedWrapper parallax parallaxDirection="up" parallaxIntensity="extreme">
              <div className="transition-fade-start transition-fade delay-long">
                <Image
                  alt="Scrolling NFTL Token"
                  className="pixelated w-full h-auto"
                  width={200}
                  height={195}
                  src="/img/compete-and-earn/animated/token-4.webp"
                  sizes="100vw"
                />
              </div>
            </AnimatedWrapper>
          </div>
        </div>
      </section>

      {/* NIFTYVERSE */}
      <section className="container section relative flex flex-row flex-wrap items-center">
        <div className="w-full md:w-1/2">
          <AnimatedWrapper>
            <div className="transition-fade transition-fade-start delay-normal">
              <Image
                src="/img/logos/niftyverse/app_logo.webp"
                alt="Land in the Niftyverse"
                width={612}
                height={482}
                sizes="100vw"
                className="w-full h-auto"
              />
            </div>
          </AnimatedWrapper>
        </div>
        <div className="w-full md:w-1/2 relative pl-0 md:pl-6">
          <div className="purple-bg-orb orb-top-right" />
          <div className="flex flex-col relative items-center md:items-start">
            <AnimatedWrapper>
              <h2 className="mb-3 section-title section-heading transition-vertical-fade transition-vertical-fade-start delay-lite">
                <span className="whitespace-nowrap">DISCOVER THE</span>
                <br />
                NIFTYVERSE
              </h2>
            </AnimatedWrapper>
            <AnimatedWrapper>
              <p className="my-0 py-1 lg:py-3 section-description transition-vertical-fade transition-vertical-fade-start delay-normal">
                A VIRTUAL SOCIAL HUB LIKE NONE OTHER FOR GAMERS.
              </p>
            </AnimatedWrapper>
            <ThemeBtnGroup
              className="md:justify-start"
              primary={{ title: 'COMING SOON', disabled: true }}
              secondary={{ href: '/niftyverse', title: 'LEARN MORE' }}
            />
          </div>
        </div>
      </section>

      {/* DASHBOARDS */}
      <section className="section w-screen relative">
        <AnimatedWrapper>
          <div className="relative flex-grow transition-fade transition-fade-start delay-lite">
            <Image
              src="/img/misc/dashboard.webp"
              alt="App Dashboard"
              width={1920}
              height={1172}
              className="w-full h-auto"
              sizes="100vw"
            />
            <div className="dark-gradient-overlay" />
          </div>
        </AnimatedWrapper>

        <div className="flex flex-col relative w-full items-center px-4 md:absolute md:w-1/2 md:items-start md:h-full md:justify-center md:pl-10 md:top-0 lg:-top-20">
          <AnimatedWrapper>
            <h2 className="mb-3 section-heading transition-vertical-fade transition-vertical-fade-start delay-lite">
              DASHBOARDS
            </h2>
          </AnimatedWrapper>
          <AnimatedWrapper>
            <p className="my-0 py-1 py-lg-3 section-description transition-vertical-fade transition-vertical-fade-start delay-normal">
              ACCESS WEB3-ENABLED PLAYER DASHBOARDS TO SEE YOUR GAME STATS, WINNINGS, AND NIFTY LEAGUE ASSETS.
            </p>
          </AnimatedWrapper>
          <ThemeBtnGroup
            className="md:justify-start"
            primary={{ href: 'https://app.niftyleague.com', title: 'WEB3 APP', external: true }}
            secondary={{ href: DEGEN_COLLECTION_URL, title: 'BUY A DEGEN', external: true }}
          />
        </div>
      </section>

      {/* NFTL TOKEN */}
      <section className="section container relative flex flex-row flex-wrap-reverse items-center">
        <div className="relative w-full md:w-1/2 flex flex-col text-center md:text-left">
          <div className="purple-bg-orb orb-top-left" />
          <div className="hidden md:block relative">
            <BouncingNFTL classes={{ token2: 'hidden' }} />
          </div>

          <AnimatedWrapper>
            <h2 className="mb-3 section-heading transition-vertical-fade transition-vertical-fade-start delay-lite">
              NFTL TOKEN
            </h2>
          </AnimatedWrapper>
          <AnimatedWrapper>
            <p className="py-1 lg:py-3 transition-vertical-fade transition-vertical-fade-start delay-normal">
              NFTL IS OUR GOVERNANCE &amp; UTILITY TOKEN. GOVERN THE FUTURE OF NIFTY LEAGUE &amp; ACCESS EXCLUSIVE GAME
              ASSETS.
            </p>
          </AnimatedWrapper>
          <ThemeBtnGroup
            className="md:justify-start"
            primary={{
              href: 'https://quickswap.exchange/#/analytics/v3/token/0xb0d7e9ff5fb8e739c4990f7920d8047acfae4884',
              title: 'TRADE NFTL',
              external: true,
            }}
            secondary={{ href: '/docs/overview/nifty-dao/nftl/overview', title: 'LEARN MORE', external: true }}
          />
        </div>
        <div className="relative w-full md:w-1/2">
          <MintOMatic />
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="section container relative flex flex-row flex-wrap items-center">
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <AnimatedWrapper>
            <div className="relative flex-grow transition-quick-pop transition-quick-pop-start delay-normal home-community-image">
              <Image
                src="/img/leaderboards/podium.webp"
                alt="The Best Community on Earth"
                width={382}
                height={411}
                className="w-85 h-auto"
                sizes="100vw"
              />
            </div>
          </AnimatedWrapper>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start md:flex-col-reverse">
          <div className="w-full">
            <AnimatedWrapper>
              <div className="transition-fade transition-fade-start delay-lite md:-ml-[20px]">
                <Image
                  src="/img/degens/community-characters.webp"
                  alt="Community DEGENs"
                  width={596}
                  height={194}
                  sizes="100vw"
                  className="w-full h-auto pixelated"
                />
              </div>
            </AnimatedWrapper>
          </div>

          <div className="w-full flex flex-col relative text-center md:text-left">
            <div className="purple-bg-orb orb-top-right" />
            <div className="w-full xl:mt-20">
              <AnimatedWrapper>
                <h2 className="mb-3 section-title section-heading transition-vertical-fade transition-vertical-fade-start delay-lite">
                  COMMUNITY
                </h2>
              </AnimatedWrapper>
            </div>
            <AnimatedWrapper>
              <p className="py-1 transition-vertical-fade transition-vertical-fade-start delay-normal">
                WE HATE TO BRAG, BUT OUR COMMUNITY IS TRULY TOP-NOTCH! JOIN OUR DISCORD TO CONNECT WITH OTHERS DEGENS
                &amp; HELP SHAPE NIFTY LEAGUE&apos;S FUTURE.
              </p>
            </AnimatedWrapper>
            <ThemeBtnGroup
              className="md:justify-start"
              primary={{
                href: 'https://discord.gg/niftyleague',
                title: isMobile ? 'DISCORD' : 'JOIN DISCORD',
                external: true,
              }}
              secondary={{ href: '/community', title: 'VIEW MORE' }}
            />
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section className="section w-screen relative text-center">
        <AnimatedWrapper>
          <h2 className="my-3 lg:my-5 section-heading transition-vertical-fade transition-vertical-fade-start delay-lite">
            PROUDLY BACKED BY
          </h2>
        </AnimatedWrapper>
        <Sponsors sponsors={SPONSORS} />
        <ThemeBtnGroup
          primary={{ href: '/careers', title: 'JOIN THE TEAM' }}
          secondary={{ href: '/blog', title: isMobile ? 'READ BLOG' : 'READ OUR BLOG', external: true }}
        />
      </section>
    </MainLayout>
  );
};

export default Home;
