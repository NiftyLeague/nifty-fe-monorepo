import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

import BouncingNFTL from '@/components/BouncingNFTL'
import MintOMatic from '@/components/MintOMatic'

export default function HomeTokenSection() {
  return (
    <section class="home-nftl-token-section section container relative flex flex-row flex-wrap-reverse items-center">
      <div class="relative w-full md:w-1/2 flex flex-col text-center md:text-left">
        <div class="purple-bg-orb orb-top-left" />
        <div class="hidden md:block relative">
          <BouncingNFTL visibleTokens={['token1', 'token3']} />
        </div>

        <h1 class="mb-3 section-heading transition-vertical-fade">NFTL TOKEN</h1>
        <p class="py-1 lg:py-3 transition-vertical-fade">
          NFTL IS OUR GOVERNANCE &amp; UTILITY TOKEN. GOVERN THE FUTURE OF NIFTY LEAGUE &amp; ACCESS
          EXCLUSIVE GAME ASSETS.
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
                LEARN MORE<span class="sr-only"> about the NFTL token</span>
              </>
            ),
          }}
        />
      </div>
      <div class="home-nftl-token-art relative w-full md:w-1/2">
        <MintOMatic />
      </div>
    </section>
  )
}
