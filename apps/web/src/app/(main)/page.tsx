import { preload } from 'react-dom'

import { DeferredConsoleGame } from '@nl/ui/custom/deferred-console-game'
import { ConsoleGameBackdrop } from '@nl/ui/custom/console-game-backdrop'
import OptimizedImage, { getOptimizedImageProps } from '@nl/ui/custom/optimized-image'
import { DesktopOnlyImage } from '@nl/ui/custom/responsive-only-image'

import {
  DeferredHomeCommunity,
  DeferredHomeCompete,
  DeferredHomeDashboard,
  DeferredHomeDegens,
  DeferredHomeNiftyWorld,
  DeferredHomeSponsors,
  DeferredHomeToken,
} from '@/components/DeferredHomeSections'
import MainLayout from '@/components/MainLayout'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'
import { DEGEN_COLLECTION_URL } from '@/constants/degen-assets'

import '@/styles/home.css'
import '@/styles/marketing.css'

const ResponsiveIntroBackground = () => {
  const commonProps = {
    alt: '',
    fetchPriority: 'high' as const,
    sizes: '100vw',
    quality: 60,
  }
  const desktopBackground = getOptimizedImageProps({
    ...commonProps,
    src: '/img/hero/bg.webp',
    width: 1920,
    height: 1042,
  })
  const mobileBackground = getOptimizedImageProps({
    ...commonProps,
    src: '/img/backgrounds/banner-dark.webp',
    width: 2000,
    height: 1000,
  })

  preload(desktopBackground.src, {
    as: 'image',
    fetchPriority: 'high',
    imageSizes: commonProps.sizes,
    imageSrcSet: desktopBackground.srcSet,
    media: '(min-width: 769px)',
  })
  preload(mobileBackground.src, {
    as: 'image',
    fetchPriority: 'high',
    imageSizes: commonProps.sizes,
    imageSrcSet: mobileBackground.srcSet,
    media: '(max-width: 768px)',
  })

  return (
    <picture className="home-intro-background">
      <source media="(max-width: 768px)" srcSet={mobileBackground.srcSet} />
      <img
        {...desktopBackground}
        alt=""
        loading="eager"
        fetchPriority="high"
        className="object-cover animate-zoom-out"
      />
    </picture>
  )
}

const DesktopIntro = () => {
  return (
    <section className="desktop relative w-screen max-h-screen overflow-hidden home-desktop-intro">
      <div className="relative h-full w-full">
        <div className="absolute home-hero-characters-image flex-grow animate-zoom-out-large">
          <DesktopOnlyImage
            src="/img/hero/characters.webp"
            alt="Nifty Hero Characters"
            width={1920}
            height={1042}
            sizes="100vw"
            quality={60}
            className="w-full h-auto"
          />
        </div>
        <div className="home-hero-companion">
          <div className="relative flex-grow">
            <div className="animate-hover transition-fade">
              <DesktopOnlyImage
                src="/img/hero/companion-base.webp"
                alt="Home Hero Companion Base"
                width={175}
                height={175}
                className="pixelated w-full h-auto"
                sizes="12vw"
              />
              <div className="absolute home-hero-companion-swing animate-propeller" />
            </div>
          </div>
        </div>
        <div className="home-hero-halo">
          <div className="flex-grow">
            <div className="animate-hover transition-fade">
              <DesktopOnlyImage
                src="/img/hero/halo.webp"
                alt="Home Hero Halo"
                width={133}
                height={50}
                sizes="9vw"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
        <div className="dark-gradient-overlay" />
      </div>

      <div className="home-satoshi-container">
        <div className="relative flex-grow home-satoshi transition-quick-pop-left">
          <DesktopOnlyImage
            alt="Satoshi"
            src="/img/hero/satoshi.webp"
            width={180}
            height={190}
            sizes="226px"
            className="object-cover w-full h-auto"
          />
        </div>
      </div>

      <div className="flex flex-col mt-auto home-content">
        <h1 className="home-content-title transition-vertical-fade">
          WELCOME TO <br />
          NIFTY LEAGUE
        </h1>
        <div className="my-2 lg:my-4">
          <p className="home-content-description transition-vertical-fade">
            <span className="whitespace-nowrap">DECENTRALIZED GAME STUDIO & PUBLISHER.</span>
            <br />
            <span className="whitespace-nowrap">BY GAMERS, FOR GAMERS.</span>
          </p>
        </div>
        <a
          href="#gaming-section"
          aria-label="Learn more about Nifty League"
          className="inline-block relative flex-grow satoshi-learn-more transition-fade-slow"
        >
          <DesktopOnlyImage
            src="/img/hero/speech-bubble.webp"
            alt="Learn More"
            width={348}
            height={108}
            sizes="407px"
            quality={60}
            className="w-full h-auto"
          />
          <p className="m-0 p-0 speech-bubble-text">Learn More!</p>
        </a>
      </div>
    </section>
  )
}

const MobileIntro = () => {
  return (
    <section className="mobile m-0 p-0 relative pt-5 home-mobile-intro">
      <div className="overlay-dark min-h-screen" />
      <div className="dark-gradient-overlay" />
      <div className="w-full relative min-h-screen flex flex-col justify-center text-center items-center">
        <h1 className="mt-0 sm:mt-4 md:mt-5">Nifty League</h1>
        <h5 className="mt-2 [word-spacing:-10px]">By Gamers. For Gamers.</h5>
        <p className="my-4 text-center whitespace-nowrap">Community-Governed Game Studio</p>
        <ThemeButtonGroup
          className="mt-2 xl:mt-2 mb-2"
          primary={{ href: 'https://app.niftyleague.com', title: 'PLAY NOW', external: true }}
        />
        <div className="flex items-center mt-3 mb-5">
          <a
            className="pr-4"
            href="https://discord.gg/niftyleague"
            target="_blank"
            rel="noreferrer"
          >
            <OptimizedImage
              src="/icons/socials/discord.svg"
              alt="Discord Logo"
              width={26}
              height={22}
            />
          </a>
          <a
            className="pr-4"
            href="https://twitter.com/NiftyLeague"
            target="_blank"
            rel="noreferrer"
          >
            <OptimizedImage
              src="/icons/socials/twitter.svg"
              alt="Twitter Logo"
              width={26}
              height={22}
            />
          </a>
          <a className="pr-4" href={DEGEN_COLLECTION_URL} target="_blank" rel="noreferrer">
            <OptimizedImage src="/icons/opensea.svg" alt="OpenSea Logo" width={24} height={22} />
          </a>
          <a href="https://www.twitch.tv/niftyleagueofficial" target="_blank" rel="noreferrer">
            <OptimizedImage
              src="/icons/socials/twitch.svg"
              alt="Twitch Logo"
              width={24}
              height={22}
            />
          </a>
        </div>
      </div>
    </section>
  )
}

const Home = () => {
  return (
    <MainLayout classes={{ root: 'home-pg' }}>
      <div className="home-intro">
        <ResponsiveIntroBackground />
        <MobileIntro />
        <DesktopIntro />
      </div>

      {/* SMASHERS */}
      <section id="gaming-section" className="w-screen relative text-center">
        <h2 className="absolute w-full z-10 -mt-4 sm:mt-8 md:mt-16 lg:mt-22 transition-vertical-fade">
          CLASSIC GAMING REINVENTED
        </h2>

        <DeferredConsoleGame src="/video/smashers.mp4">
          <ConsoleGameBackdrop loading="eager" fetchPriority="low" />
        </DeferredConsoleGame>

        <ThemeButtonGroup
          className="absolute bottom-0 sm:bottom-4"
          primary={{ href: 'https://niftysmashers.com', title: 'SMASHERS', external: true }}
          secondary={{ href: '/games', title: 'MORE GAMES' }}
        />
      </section>

      <DeferredHomeDegens />
      <DeferredHomeCompete />
      <DeferredHomeNiftyWorld />
      <DeferredHomeDashboard />
      <DeferredHomeToken />
      <DeferredHomeCommunity />
      <DeferredHomeSponsors />
    </MainLayout>
  )
}

export default Home
