import OptimizedImage from '@nl/ui/custom/optimized-image'
import { MobileOnlyImage } from '@nl/ui/custom/responsive-only-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

import BouncingNFTL from '@/components/BouncingNFTL'
import CompeteArtwork from '@/components/CompeteArtwork'

export default function HomeCompeteSection() {
  return (
    <section class="home-nftl-ecosystem-section container section relative flex items-center">
      <div class="w-full md:w-1/2 flex flex-col relative">
        <div class="purple-bg-orb orb-top-left" />
        <div class="block md:hidden relative w-full">
          <div class="transition-quick-pop">
            <MobileOnlyImage
              src="/img/compete-and-earn/mobile.webp"
              alt="Compete and Earn"
              width={655}
              height={275}
              sizes="100vw"
              class="w-full h-auto"
            />
          </div>
        </div>

        <div class="hidden md:block relative">
          <BouncingNFTL visibleTokens={['token1', 'token2']} />
        </div>

        <div class="relative flex flex-col items-center md:items-start">
          <h2 class="mb-3 max-w-[400px] section-heading transition-vertical-fade">
            NFTL
            <br />
            <span class="font-default font-normal text-highlight-purple">GOVERN TOGETHER</span>
          </h2>
          <p class="my-0 py-1 md:py-3 section-description transition-vertical-fade">
            Compete, earn, and help govern the future of the Nifty League ecosystem.
          </p>
          <ThemeButtonGroup
            class="md:justify-start"
            primary={{
              href: 'https://quickswap.exchange/#/analytics/v3/token/0xb0d7e9ff5fb8e739c4990f7920d8047acfae4884',
              title: 'TRADE NFTL',
              external: true,
            }}
            secondary={{
              href: '/docs/overview/nifty-dao/nftl/overview',
              external: true,
              title: (
                <>
                  NFTL DOCS<span class="sr-only"> about the NFTL token</span>
                </>
              ),
            }}
          />
        </div>
      </div>

      <div class="hidden md:block w-1/2 relative">
        <CompeteArtwork />
        <div class="absolute scrolling-nftl-token">
          <div>
            <div class="transition-fade">
              <OptimizedImage
                alt="Scrolling NFTL Token"
                class="pixelated w-full h-auto"
                width={200}
                height={195}
                loading="lazy"
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
