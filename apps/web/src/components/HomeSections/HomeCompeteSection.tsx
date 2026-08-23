'use client'

import OptimizedImage from '@nl/ui/custom/optimized-image'
import { DeferredSection } from '@nl/ui/custom/deferred-section'
import { MobileOnlyImage } from '@nl/ui/custom/responsive-only-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

import BouncingNFTL from '@/components/BouncingNFTL'

const loadCompeteArtwork = () => import('@/components/CompeteArtwork')

export default function HomeCompeteSection() {
  return (
    <section className="container section relative flex items-center">
      <div className="w-full md:w-1/2 flex flex-col relative">
        <div className="purple-bg-orb orb-top-left" />
        <div className="block md:hidden relative w-full">
          <div className="transition-quick-pop">
            <MobileOnlyImage
              src="/img/compete-and-earn/mobile.webp"
              alt="Compete and Earn"
              width={655}
              height={275}
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="hidden md:block relative">
          <BouncingNFTL visibleTokens={['token1', 'token2']} />
        </div>

        <div className="relative flex flex-col items-center md:items-start">
          <h2 className="mb-3 max-w-[400px] section-heading transition-vertical-fade">
            SMASHERS
            <br />
            <span className="whitespace-nowrap font-default font-normal">COMPETE &amp; EARN</span>
          </h2>
          <p className="my-0 py-1 md:py-3 section-description transition-vertical-fade">
            4 - 16 PLAYERS COMPETE IN A CUT-THROAT BATTLE FOR THE SURVIVAL OF THE FITTEST!
          </p>
          <ThemeButtonGroup
            className="md:justify-start"
            primary={{
              href: 'https://niftysmashers.com',
              title: "LET'S BRAWL!",
              responsiveTitle: { mobile: 'BRAWL!', desktop: "LET'S BRAWL!" },
              external: true,
            }}
            secondary={{ href: '/compete-and-earn', title: 'LEARN MORE' }}
          />
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative">
        <DeferredSection
          label="compete artwork"
          load={loadCompeteArtwork}
          minHeightClassName="min-h-[24rem] md:min-h-[30rem]"
          rootMargin="160px"
        />
        <div className="absolute scrolling-nftl-token">
          <div>
            <div className="transition-fade">
              <OptimizedImage
                alt="Scrolling NFTL Token"
                className="pixelated w-full h-auto"
                width={200}
                height={195}
                src="/img/compete-and-earn/animated/token-4.webp"
                sizes="246px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
