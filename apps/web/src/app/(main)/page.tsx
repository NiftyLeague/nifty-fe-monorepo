'use client';

import { Stack, useMediaQuery } from '@mui/material';
import { useRef } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import Sponsors from '@/components/Sponsors';
import Carousel from '@/components/Carousel';
import ExternalIcon from '@/components/ExternalIcon';
import ConsoleGame from '@/components/ConsoleGame';
import MintOMatic from '@/components/MintOMatic';
import { RenderDegen } from '@/components/Carousel/DegenCardItem';
import { COMMUNITY_DEGEN_LIST } from '@/constants/degens';
import { SPONSORS } from '@/constants/sponsors';

const DesktopIntro = ({ scrollToGamingSection }: { scrollToGamingSection: () => void }) => {
  return (
    <div className="p-0 relative home-intro">
      <div>
        <div className="relative flex-grow home-banner animation-zoomin">
          <Image
            src="/img/hero/bg.webp"
            alt="Nifty Home Banner"
            width={3408}
            height={1849}
            priority
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
        <AnimatedWrapper parallax parallaxDirection="top" transitionAmount="small">
          <div className="parallax-hero-child absolute home-hero-characters-image flex-grow animation-zoomin-large">
            <Image
              src="/img/hero/characters.webp"
              alt="Nifty Hero Characters"
              width={3408}
              height={1849}
              priority
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>
        </AnimatedWrapper>
        <div className="home-hero-companion">
          <div className="relative flex-grow">
            <AnimatedWrapper>
              <div className="animation-bounce animated-fade-start animated-fade transition-delay-extreme">
                <Image
                  src="/img/hero/companion-base.webp"
                  alt="Home Hero Companion Base"
                  width={436}
                  height={436}
                  className="pixelated w-full h-auto"
                  sizes="100vw"
                />
                <div className="absolute home-hero-companion-swing animation-propeller" />
              </div>
            </AnimatedWrapper>
          </div>
        </div>
        <div className="home-hero-halo">
          <div className="flex-grow">
            <AnimatedWrapper>
              <div className="animation-bounce2 animated-fade-start animated-fade transition-delay-extreme">
                <Image
                  src="/img/hero/halo.webp"
                  alt="Home Hero Halo"
                  width={200}
                  height={200}
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
          <div className="relative flex-grow home-satoshi satoshi-quick-pop-anim satoshi-quick-pop-anim-start transition-delay-medium">
            <Image
              alt="Satoshi"
              src="/img/hero/satoshi.webp"
              priority
              width={556}
              height={589}
              sizes="100vw"
              className="object-cover w-full h-auto"
            />
          </div>
        </AnimatedWrapper>
      </div>
      <div className="flex flex-col mt-auto home-content">
        <AnimatedWrapper>
          <h1 className="home-content-title animated-header-text animated-header-text-start">
            WELCOME TO <br />
            NIFTY LEAGUE
          </h1>
        </AnimatedWrapper>
        <div className="my-2 lg:my-4">
          <AnimatedWrapper>
            <p className="home-content-description animated-header-text animated-header-text-start transition-delay-small">
              <span className="whitespace-nowrap">DECENTRALIZED GAME STUDIO & PUBLISHER.</span>
              <br />
              <span className="whitespace-nowrap">BY GAMERS, FOR GAMERS.</span>
            </p>
          </AnimatedWrapper>
        </div>
        <div>
          <AnimatedWrapper>
            <div
              className="inline-block relative flex-grow satoshi-learn-more animated-fade-slow animated-fade-start transition-delay-large"
              onClick={scrollToGamingSection}
            >
              <Image
                src="/img/hero/speech-bubble.webp"
                alt="Learn More"
                width={407}
                height={125}
                sizes="100vw"
                className="w-full h-auto"
              />
              <p className="m-0 p-0 speech-bubble-text">Learn More!</p>
            </div>
          </AnimatedWrapper>
        </div>
      </div>
    </div>
  );
};

const MobileIntro = () => {
  return (
    <div className="m-0 p-0 relative pt-5 home-mobile-intro">
      <div className="overlay-dark min-h-screen" />
      <div className="dark-gradient-overlay" />
      <div className="relative flex flex-col items-center text-center my-auto py-3 pt-5 md:pt-5">
        <h1 className="mt-0 sm:mt-4 md:mt-5">Nifty League</h1>
        <h5 className="mt-2">By Gamers. For Gamers.</h5>
        <p className="my-4 text-center whitespace-nowrap">Community-Governed Game Studio</p>
        <AnimatedWrapper>
          <a
            href="https://app.niftyleague.com/"
            target="_blank"
            rel="noreferrer"
            className="theme-btn-primary animated-fade animated-fade-start transition-delay-medium"
          >
            START PLAYING <ExternalIcon className="inline-block ml-1" />
          </a>
        </AnimatedWrapper>
        <div className="flex items-center mt-3 mb-5 social-icons">
          <a className="pr-4" href="https://discord.gg/niftyleague" target="_blank" rel="noreferrer">
            <Image src="/icons/socials/discord.svg" alt="Discord Logo" width={26} height={22} />
          </a>
          <a className="pr-4" href="https://twitter.com/NiftyLeague" target="_blank" rel="noreferrer">
            <Image src="/icons/socials/twitter.svg" alt="Twitter Logo" width={26} height={22} />
          </a>
          <a className="pr-4" href="https://opensea.io/collection/niftydegen" target="_blank" rel="noreferrer">
            <Image src="/icons/opensea.svg" alt="OpenSea Logo" width={24} height={22} />
          </a>
          <a href="https://www.twitch.tv/niftyleagueofficial" target="_blank" rel="noreferrer">
            <Image src="/icons/socials/twitch.svg" alt="Twitch Logo" width={24} height={22} />
          </a>
        </div>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const isDesktop = useMediaQuery('(min-width:769px)');
  const isMobile = useMediaQuery('(max-width:768px)');
  const gamingSectionRef = useRef<HTMLDivElement>(null);

  const scrollToGamingSection = () => {
    if (!gamingSectionRef.current) return;
    (gamingSectionRef.current as HTMLDivElement).scrollIntoView();
  };

  return (
    <Layout classes={{ root: 'home-pg' }}>
      {isMobile ? <MobileIntro /> : <DesktopIntro scrollToGamingSection={scrollToGamingSection} />}

      {/* SMASHERS */}
      <div className="relative p-0 m-0" ref={gamingSectionRef}>
        <div className="flex flex-col text-center relative p-0">
          <AnimatedWrapper>
            <h2 className="absolute w-full z-10 mt-8 md:mt-16 lg:mt-22 animated-header-text animated-header-text-start">
              CLASSIC GAMING REINVENTED
            </h2>
          </AnimatedWrapper>

          <ConsoleGame src="/video/smashers.mp4" />

          <div className="flex flex-row justify-center items-center gap-2 xl:gap-4 px-2 md:px-0 mt-2 sm:mt-0 md:pb-4 game-playing-actions">
            <AnimatedWrapper>
              <a
                href="https://niftysmashers.com"
                target="_blank"
                rel="noreferrer"
                className="theme-btn-primary animated-fade animated-fade-start transition-delay-medium"
              >
                START PLAYING
              </a>
            </AnimatedWrapper>
            <AnimatedWrapper>
              <Link
                href="/games"
                className="theme-btn-transparent animated-fade animated-fade-start transition-delay-medium"
              >
                MORE GAMES
              </Link>
            </AnimatedWrapper>
          </div>
        </div>
      </div>

      {/* DEGENS */}
      <div className="relative pt-16 pb-8 px-0 mx-0 mb-12 sliding-nfts">
        <div className="flex flex-col text-center relative p-0">
          <div className="my-3 lg:my-5">
            <AnimatedWrapper>
              <h2 className="px-5 sm:px-8 animated-header-text animated-header-text-start">
                COMMUNITY-GENERATED AVATARS
              </h2>
            </AnimatedWrapper>
          </div>

          <div className="relative pt-16 pb-8 px-0 mx-0 mb-12">
            <div className="absolute inset-0 mt-20 flex items-center justify-center z-10 pointer-events-none">
              <Image
                className="pixelated w-full h-auto max-w-[90vw] md:max-w-[80%] lg:max-w-[700px] xl:max-w-[800px]"
                src="/img/degens/nifty-ape.webp"
                width={856}
                height={842}
                alt="ape degen overlay"
                sizes="(max-width: 576px) 90vw, (max-width: 992px) 80%, 700px"
              />
            </div>
            <Carousel mobileItems={2}>{COMMUNITY_DEGEN_LIST.map(RenderDegen)}</Carousel>
          </div>
        </div>
      </div>

      {/* COMPETE & EARN */}
      <div className="relative pt-16 pb-8 px-0 mx-auto max-w-7xl">
        <div className="flex px-3 md:px-4 relative items-center">
          <div className={`${isDesktop ? 'w-1/2' : 'w-full'}`}>
            <div className="flex flex-col compete-to-earn-section relative">
              {isDesktop && (
                <>
                  <div className="compete-to-earn-section-token-1">
                    <div className="relative flex-grow">
                      <AnimatedWrapper parallax parallaxDirection="left">
                        <div className="animation-bounce-coin1 animated-fade animated-fade-start transition-delay-large">
                          <Image
                            src="/img/compete-and-earn/animated/token-1.webp"
                            alt="Compete and Earn NFTL 1"
                            width={413}
                            height={408}
                            className="w-full h-auto"
                            sizes="100vw"
                          />
                        </div>
                      </AnimatedWrapper>
                    </div>
                  </div>
                  <div className="compete-to-earn-section-token-2">
                    <div className="relative flex-grow">
                      <AnimatedWrapper parallax parallaxDirection="right">
                        <div className="animation-bounce-coin2 animated-fade animated-fade-start transition-delay-large">
                          <Image
                            src="/img/compete-and-earn/animated/token-2.webp"
                            alt="Compete and Earn NFTL 2"
                            width={398}
                            height={390}
                            className="w-full h-auto"
                            sizes="100vw"
                          />
                        </div>
                      </AnimatedWrapper>
                    </div>
                  </div>
                  <div className="compete-to-earn-section-token-3">
                    <div className="relative flex-grow">
                      <AnimatedWrapper parallax parallaxDirection="top">
                        <div className="animation-bounce-coin3 animated-fade animated-fade-start transition-delay-large">
                          <Image
                            src="/img/compete-and-earn/animated/token-3.webp"
                            alt="Compete and Earn NFTL 3"
                            width={492}
                            height={192}
                            className="w-full h-auto"
                            sizes="100vw"
                          />
                        </div>
                      </AnimatedWrapper>
                    </div>
                  </div>
                </>
              )}
              <Stack gap={2} sx={{ alignItems: 'center' }}>
                {!isDesktop && (
                  <div className="relative flex-grow w-full">
                    <AnimatedWrapper>
                      <div className="quick-pop-anim quick-pop-anim-start transition-delay-small">
                        <Image
                          src="/img/compete-and-earn/mobile.webp"
                          alt="Compete and Earn"
                          width={3208}
                          height={1342}
                          sizes="100vw"
                          className="w-full h-auto"
                        />
                        <div className="dark-gradient-overlay" />
                      </div>
                    </AnimatedWrapper>
                  </div>
                )}
                <div className={`flex flex-col relative compete-to-earn-section-body`}>
                  <div className="orb-top-left purple-bg-orb" />
                  <div className="mb-3">
                    <AnimatedWrapper>
                      <h2 className="max-w-[400px] section-heading animated-header-text animated-header-text-start transition-delay-small">
                        SMASHERS
                        <br />
                        <span className="whitespace-nowrap">COMPETE & EARN</span>
                      </h2>
                    </AnimatedWrapper>
                  </div>
                  <div className="my-0">
                    <AnimatedWrapper>
                      <p className="py-1 py-lg-3 section-description animated-header-text animated-header-text-start transition-delay-medium">
                        4 - 16 PLAYERS COMPETE IN A CUT-THROAT BATTLE FOR THE SURVIVAL OF THE FITTEST!
                      </p>
                    </AnimatedWrapper>
                  </div>
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                    gap={{ xs: 1.25, xl: 4 }}
                    mt={{ xs: 1.25, xl: 4 }}
                    className="section-actions"
                  >
                    <AnimatedWrapper>
                      <a
                        href="https://niftysmashers.com"
                        target="_blank"
                        rel="noreferrer"
                        className="theme-btn-primary animated-fade animated-fade-start transition-delay-large"
                      >
                        LET&apos;S BRAWL!
                      </a>
                    </AnimatedWrapper>
                    <AnimatedWrapper>
                      <Link
                        href="/compete-and-earn"
                        className="theme-btn-transparent animated-fade animated-fade-start transition-delay-large"
                      >
                        LEARN MORE
                      </Link>
                    </AnimatedWrapper>
                  </Stack>
                </div>
              </Stack>
            </div>
          </div>
          {isDesktop && (
            <div className="w-1/2 relative">
              <AnimatedWrapper>
                <div className="quick-pop-anim quick-pop-anim-start transition-delay-medium">
                  <Image
                    src="/img/compete-and-earn/animated/competitors.webp"
                    alt="Compete and Earn"
                    width={1648}
                    height={1319}
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                </div>
              </AnimatedWrapper>
              <div className="absolute compete-to-earn-section-token-4">
                <AnimatedWrapper parallax parallaxDirection="bottom" transitionAmount="extreme">
                  <div className="animated-fade-start animated-fade transition-delay-large">
                    <Image
                      alt="Compete and Earn NFTL Token"
                      className="pixelated w-full h-auto"
                      width={641}
                      height={640}
                      src="/img/compete-and-earn/animated/token-4.webp"
                      sizes="100vw"
                    />
                  </div>
                </AnimatedWrapper>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NIFTYVERSE */}
      <div className="pt-16 mx-auto inner-container">
        <div className="flex px-3 md:px-4 relative items-center">
          {isDesktop && (
            <div className="w-1/2 relative">
              <AnimatedWrapper>
                <div className="animated-fade animated-fade-start transition-delay-medium">
                  <Image
                    src="/img/logos/niftyverse/app_logo.webp"
                    alt="Land in the Niftyverse"
                    width={3055}
                    height={2406}
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                </div>
              </AnimatedWrapper>
            </div>
          )}
          <div className={`${isDesktop ? 'w-1/2' : 'w-full'} flex flex-col land-in-the-niftyverse-section`}>
            <div className="pl-0 xl:pl-6 flex flex-col gap-2">
              {!isDesktop && (
                <div className="relative w-full text-center">
                  <Image
                    src="/img/logos/niftyverse/app_logo.webp"
                    alt="Land in the NiftyVerse"
                    width={1920}
                    height={1512}
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                </div>
              )}
              <div className={`flex flex-col relative ${isDesktop ? 'items-start' : 'items-center'}`}>
                <div className="orb-bottom-right purple-bg-orb" />
                <div className="mb-3">
                  <AnimatedWrapper>
                    <h2 className="section-title section-heading animated-header-text animated-header-text-start transition-delay-small">
                      <span className="whitespace-nowrap">DISCOVER THE</span>
                      <br />
                      NIFTYVERSE
                    </h2>
                  </AnimatedWrapper>
                </div>
                <div className="my-0">
                  <AnimatedWrapper>
                    <p className="py-1 lg:py-3 section-description animated-header-text animated-header-text-start transition-delay-medium">
                      A VIRTUAL SOCIAL HUB LIKE NONE OTHER FOR GAMERS.
                    </p>
                  </AnimatedWrapper>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-1.25 xl:gap-4 mt-1.25 xl:mt-4 section-actions">
                  <AnimatedWrapper>
                    <button
                      disabled
                      className="theme-btn-primary animated-fade animated-fade-start transition-delay-large"
                    >
                      COMING SOON
                    </button>
                  </AnimatedWrapper>
                  <AnimatedWrapper>
                    <Link
                      href="/niftyverse"
                      className="theme-btn-transparent animated-fade animated-fade-start transition-delay-large"
                    >
                      LEARN MORE
                    </Link>
                  </AnimatedWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARDS */}
      <div className="flex flex-wrap pt-16">
        <div className="w-full relative">
          {isDesktop && (
            <AnimatedWrapper>
              <div className="relative flex-grow animated-fade animated-fade-start transition-delay-small">
                <Image
                  src="/img/misc/dashboard.webp"
                  alt="App Dashboard"
                  width={3590}
                  height={2192}
                  className="pixelated w-full h-auto"
                  sizes="100vw"
                />
                <div className="dark-gradient-overlay" />
              </div>
            </AnimatedWrapper>
          )}
          <div className="flex flex-col px-3 home-dashboard-section">
            <Stack gap={2}>
              {!isDesktop && (
                <div className="relative flex-grow w-screen -ml-4">
                  <Image
                    src="/img/misc/dashboard.webp"
                    alt="App Dashboard"
                    width={3590}
                    height={2192}
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                  <div className="dark-gradient-overlay" />
                </div>
              )}
              <div className="flex flex-col home-dashboard-section-body">
                <div className="mb-3">
                  <AnimatedWrapper>
                    <h2 className="section-heading animated-header-text animated-header-text-start transition-delay-small">
                      DASHBOARDS
                    </h2>
                  </AnimatedWrapper>
                </div>
                <div className="my-0">
                  <AnimatedWrapper>
                    <p className="py-1 py-lg-3 section-description animated-header-text animated-header-text-start transition-delay-medium">
                      ACCESS WEB3-ENABLED PLAYER DASHBOARDS TO SEE YOUR GAME STATS, WINNINGS, AND NIFTY LEAGUE ASSETS.
                    </p>
                  </AnimatedWrapper>
                </div>
                <Stack
                  direction="row"
                  alignItems={{ xs: 'flex-end', sm: 'center' }}
                  flexWrap="wrap"
                  gap={{ xs: 1.25, xl: 4 }}
                  mt={{ xs: 1.25, xl: 4 }}
                  className="section-actions"
                >
                  <AnimatedWrapper>
                    <a
                      href="https://app.niftyleague.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="theme-btn-primary animated-fade animated-fade-start transition-delay-large"
                    >
                      LAUNCH APP
                    </a>
                  </AnimatedWrapper>
                  <AnimatedWrapper>
                    <a
                      href="https://opensea.io/collection/niftydegen"
                      target="_blank"
                      rel="noreferrer"
                      className="theme-btn-transparent animated-fade animated-fade-start transition-delay-large"
                    >
                      BUY A DEGEN
                    </a>
                  </AnimatedWrapper>
                </Stack>
              </div>
            </Stack>
          </div>
        </div>
      </div>

      {/* NFTL TOKEN */}
      <div className="pt-16 mx-auto inner-container">
        <div className="flex px-3 md:px-4 relative items-center">
          <div className={`${isDesktop ? 'w-1/2' : 'w-full'}`}>
            <div className="flex flex-col home-nftl-token-section">
              <Stack gap={2}>
                {!isDesktop && (
                  <div className="relative w-full text-center">
                    <MintOMatic />
                  </div>
                )}
                <div className="flex flex-col relative home-nftl-token-section-body">
                  <div className="orb-top-left purple-bg-orb" />
                  <div className="mb-3">
                    <AnimatedWrapper>
                      <h2 className="home-nftl-token-section-title section-heading animated-header-text animated-header-text-start transition-delay-small">
                        NFTL TOKEN
                      </h2>
                    </AnimatedWrapper>
                  </div>
                  <AnimatedWrapper>
                    <p className="py-1 lg:py-3 home-nftl-token-section-description animated-header-text animated-header-text-start transition-delay-medium">
                      NFTL IS OUR GOVERNANCE &amp; UTILITY TOKEN. GOVERN THE FUTURE OF NIFTY LEAGUE &amp; ACCESS
                      EXCLUSIVE GAME ASSETS.
                    </p>
                  </AnimatedWrapper>
                  <div className="flex flex-wrap items-center gap-3 xl:gap-4 mt-3 xl:mt-4 section-actions">
                    <AnimatedWrapper>
                      <a
                        href="https://quickswap.exchange/#/analytics/v3/token/0xb0d7e9ff5fb8e739c4990f7920d8047acfae4884"
                        target="_blank"
                        rel="noreferrer"
                        className="theme-btn-primary animated-fade animated-fade-start transition-delay-large"
                      >
                        TRADE NFTL
                      </a>
                    </AnimatedWrapper>
                    <AnimatedWrapper>
                      <a
                        href="/docs/overview/nifty-dao/nftl/overview"
                        target="_blank"
                        rel="noreferrer"
                        className="theme-btn-transparent animated-fade animated-fade-start transition-delay-large"
                      >
                        LEARN MORE
                      </a>
                    </AnimatedWrapper>
                  </div>
                </div>
              </Stack>
            </div>
          </div>
          {isDesktop && (
            <div className="w-1/2 text-right relative">
              <MintOMatic />
            </div>
          )}
        </div>
      </div>

      {/* COMMUNITY */}
      <div className="pt-16 mx-auto inner-container">
        <div className="flex px-3 md:px-4 relative items-end">
          {isDesktop && (
            <div className="w-1/2">
              <AnimatedWrapper>
                <div className="relative flex-grow quick-pop-anim quick-pop-anim-start transition-delay-medium home-community-image">
                  <Image
                    src="/img/leaderboards/podium.webp"
                    alt="The Best Community on Earth"
                    width={1417}
                    height={1525}
                    className="pixelated w-full h-auto"
                    sizes="100vw"
                  />
                </div>
              </AnimatedWrapper>
            </div>
          )}
          <div className={`${isDesktop ? 'w-1/2' : 'w-full'}`}>
            <div
              className={`flex flex-col home-community-section ${
                isDesktop ? 'items-start' : 'items-center'
              } pl-0 md:pl-3 xl:pl-5 md:pr-3`}
            >
              <Stack gap={2} className="home-community-section-container">
                {!isDesktop && (
                  <AnimatedWrapper>
                    <div className="relative flex-grow w-full quick-pop-anim quick-pop-anim-start transition-delay-small">
                      <Image
                        src="/img/leaderboards/podium.webp"
                        alt="The Best Community on Earth"
                        width={1417}
                        height={1525}
                        sizes="100vw"
                        className="w-full h-auto"
                      />
                    </div>
                  </AnimatedWrapper>
                )}
                {!isDesktop && (
                  <AnimatedWrapper>
                    <div className="relative flex-grow animated-fade animated-fade-start transition-delay-small home-community-characters">
                      <Image
                        src="/img/degens/community-characters.webp"
                        alt="Community DEGENs"
                        width={1910}
                        height={620}
                        sizes="100vw"
                        className="w-full h-auto"
                      />
                    </div>
                  </AnimatedWrapper>
                )}
                <div className={`flex flex-col relative home-community-section-body`}>
                  <div className="orb-top-right purple-bg-orb" />
                  <div className="mb-3">
                    <AnimatedWrapper>
                      <h2 className="section-title section-heading animated-header-text animated-header-text-start transition-delay-small">
                        COMMUNITY
                      </h2>
                    </AnimatedWrapper>
                  </div>
                  <AnimatedWrapper>
                    <p className={`py-1 animated-header-text animated-header-text-start transition-delay-medium`}>
                      WE HATE TO BRAG, BUT OUR COMMUNITY IS TRULY TOP-NOTCH! JOIN OUR DISCORD TO CONNECT WITH OTHERS
                      DEGENS &amp; HELP SHAPE NIFTY LEAGUE&apos;S FUTURE.
                    </p>
                  </AnimatedWrapper>
                  <div className="w-full flex flex-row flex-wrap items-center justify-center gap-3 xl:gap-4 mt-4 xl:mt-6">
                    <AnimatedWrapper>
                      <a
                        href="https://discord.gg/niftyleague"
                        target="_blank"
                        rel="noreferrer"
                        className="theme-btn-primary animated-fade animated-fade-start transition-delay-large"
                      >
                        JOIN OUR DISCORD
                      </a>
                    </AnimatedWrapper>
                    <AnimatedWrapper>
                      <Link
                        href="/community"
                        className="theme-btn-transparent animated-fade animated-fade-start transition-delay-large"
                      >
                        VIEW MORE
                      </Link>
                    </AnimatedWrapper>
                  </div>
                  {isDesktop && (
                    <AnimatedWrapper>
                      <div className="relative flex-grow animated-fade animated-fade-start transition-delay-large -ml-[20px]">
                        <Image
                          alt="Community DEGENs"
                          width={1910}
                          height={620}
                          src="/img/degens/community-characters.webp"
                          sizes="100vw"
                          className="w-full h-auto"
                        />
                      </div>
                    </AnimatedWrapper>
                  )}
                </div>
              </Stack>
            </div>
          </div>
        </div>
      </div>

      {/* SPONSORS */}
      <div className="relative w-full pt-16 pb-8">
        <div className="w-full relative">
          <div className="my-3 lg:my-5 text-center">
            <AnimatedWrapper>
              <h2 className="section-heading animated-header-text animated-header-text-start transition-delay-small">
                PROUDLY BACKED BY
              </h2>
            </AnimatedWrapper>
          </div>
          {isDesktop ? (
            <AnimatedWrapper>
              <div className="w-full relative flex-grow animated-fade animated-fade-start transition-delay-medium">
                <Image
                  alt="Proudly Backed By"
                  className="pixelated w-full h-auto"
                  width={3600}
                  height={1735}
                  src="/img/sponsors/sponsors.webp"
                  sizes="100vw"
                />
                <div className="dark-gradient-overlay" />
              </div>
            </AnimatedWrapper>
          ) : (
            <Sponsors sponsors={SPONSORS} />
          )}
          <div className="flex flex-row flex-wrap justify-center items-center gap-4 xl:gap-6 mt-8 md:mt-12 w-full section-actions">
            <AnimatedWrapper>
              <Link
                href="/careers"
                className="theme-btn-primary animated-fade animated-fade-start transition-delay-large"
              >
                JOIN THE TEAM
              </Link>
            </AnimatedWrapper>
            <AnimatedWrapper>
              <Link
                href="/blog"
                target="_blank"
                rel="noreferrer"
                className="theme-btn-transparent animated-fade animated-fade-start transition-delay-large"
              >
                READ OUR BLOG
              </Link>
            </AnimatedWrapper>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
