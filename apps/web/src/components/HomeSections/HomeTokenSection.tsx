import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

import BouncingNFTL from '@/components/BouncingNFTL'
import { DeferredHomeMintOMatic } from '@/components/DeferredHomeMedia'

export default function HomeTokenSection() {
  return (
    <section className="section container relative flex flex-row flex-wrap-reverse items-center">
      <div className="relative w-full md:w-1/2 flex flex-col text-center md:text-left">
        <div className="purple-bg-orb orb-top-left" />
        <div className="hidden md:block relative">
          <BouncingNFTL visibleTokens={['token1', 'token3']} />
        </div>

        <h2 className="mb-3 section-heading transition-vertical-fade">NFTL TOKEN</h2>
        <p className="py-1 lg:py-3 transition-vertical-fade">
          NFTL IS OUR GOVERNANCE &amp; UTILITY TOKEN. GOVERN THE FUTURE OF NIFTY LEAGUE &amp; ACCESS
          EXCLUSIVE GAME ASSETS.
        </p>
        <ThemeButtonGroup
          className="md:justify-start"
          primary={{
            href: 'https://quickswap.exchange/#/analytics/v3/token/0xb0d7e9ff5fb8e739c4990f7920d8047acfae4884',
            title: 'TRADE NFTL',
            external: true,
          }}
          secondary={{
            href: '/docs/overview/nifty-dao/nftl/overview',
            title: 'LEARN MORE',
            external: true,
          }}
        />
      </div>
      <div className="relative w-full md:w-1/2">
        <DeferredHomeMintOMatic />
      </div>
    </section>
  )
}
