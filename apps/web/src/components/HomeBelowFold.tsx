'use client'

import OptimizedImage from '@nl/ui/custom/optimized-image'
import { DeferredSection } from '@nl/ui/custom/deferred-section'
import { MobileOnlyImage } from '@nl/ui/custom/responsive-only-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

import BouncingNFTL from '@/components/BouncingNFTL'
import { DEGEN_COLLECTION_URL } from '@/constants/degen-assets'

const loadCompeteArtwork = () => import('@/components/CompeteArtwork')
const loadMintOMatic = () => import('@/components/MintOMatic')
const loadSponsors = () => import('@/components/Sponsors')
const loadCommunityDegenCarousel = () => import('@/components/CommunityDegenCarousel')

const DeferredMintOMatic = () => (
  <DeferredSection
    label="NFTL mint animation"
    load={loadMintOMatic}
    minHeightClassName="min-h-[28rem]"
  />
)

const DeferredSponsors = () => (
  <DeferredSection label="sponsors" load={loadSponsors} minHeightClassName="min-h-[22rem]" />
)

const DeferredCommunityDegenCarousel = () => (
  <DeferredSection
    label="community DEGEN carousel"
    load={loadCommunityDegenCarousel}
    minHeightClassName="min-h-[22rem]"
  />
)

const HomeDegensSection = () => (
  <section className="section w-screen relative flex flex-col text-center sliding-nfts">
    <h2 className="my-3 lg:my-5 px-5 sm:px-8 transition-vertical-fade">
      <ResponsiveLabel mobile="OWN YOUR AVATAR" desktop="COMMUNITY-GENERATED AVATARS" />
    </h2>

    <div className="relative pt-16 pb-8 px-0 mx-0 mb-12">
      <div className="absolute inset-0 mt-20 flex items-center justify-center z-10 pointer-events-none">
        <OptimizedImage
          className="pixelated w-full h-auto max-w-[90vw] md:max-w-[80%] lg:max-w-[700px] xl:max-w-[800px]"
          src="/img/degens/nifty-ape.webp"
          width={856}
          height={842}
          alt="ape degen overlay"
          sizes="(max-width: 576px) 90vw, (max-width: 992px) 80%, 700px"
        />
      </div>
      <DeferredCommunityDegenCarousel />
    </div>
  </section>
)

const HomeCompeteSection = () => (
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
          <span className="whitespace-nowrap font-default font-normal">COMPETE & EARN</span>
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

const HomeNiftyWorldSection = () => (
  <section className="container section relative flex flex-row flex-wrap items-center">
    <div className="w-full md:w-1/2">
      <div className="transition-fade">
        <OptimizedImage
          src="/img/logos/niftyworld/app_logo.webp"
          alt="Land in NiftyWorld"
          width={612}
          height={482}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="w-full h-auto"
        />
      </div>
    </div>
    <div className="w-full md:w-1/2 relative pl-0 md:pl-6">
      <div className="purple-bg-orb orb-top-right" />
      <div className="flex flex-col relative items-center md:items-start">
        <h2 className="mb-3 section-title section-heading transition-vertical-fade">
          DISCOVER
          <br />
          <span className="whitespace-nowrap font-default font-normal">NIFTYWORLD</span>
        </h2>
        <p className="my-0 py-1 lg:py-3 section-description transition-vertical-fade">
          A VIRTUAL SOCIAL HUB LIKE NONE OTHER FOR GAMERS.
        </p>
        <ThemeButtonGroup
          className="md:justify-start"
          primary={{ title: 'COMING SOON', disabled: true }}
          secondary={{ href: '/niftyworld', title: 'LEARN MORE' }}
        />
      </div>
    </div>
  </section>
)

const HomeDashboardSection = () => (
  <section className="section w-screen relative">
    <div className="relative flex-grow transition-fade">
      <OptimizedImage
        src="/img/misc/dashboard.webp"
        alt="App Dashboard"
        width={1920}
        height={1172}
        className="w-full h-auto"
        sizes="100vw"
      />
      <div className="dark-gradient-overlay" />
    </div>

    <div className="flex flex-col relative w-full items-center px-4 md:absolute md:w-1/2 md:items-start md:h-full md:justify-center md:pl-10 md:top-0 lg:-top-20">
      <h2 className="mb-3 section-heading transition-vertical-fade">DASHBOARDS</h2>
      <p className="my-0 py-1 py-lg-3 section-description transition-vertical-fade">
        ACCESS WEB3-ENABLED PLAYER DASHBOARDS TO SEE YOUR GAME STATS, WINNINGS, AND NIFTY LEAGUE
        ASSETS.
      </p>
      <ThemeButtonGroup
        className="md:justify-start"
        primary={{ href: 'https://app.niftyleague.com', title: 'WEB3 APP', external: true }}
        secondary={{ href: DEGEN_COLLECTION_URL, title: 'BUY A DEGEN', external: true }}
      />
    </div>
  </section>
)

const HomeTokenSection = () => (
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
      <DeferredMintOMatic />
    </div>
  </section>
)

const HomeCommunitySection = () => (
  <section className="section container relative flex flex-row flex-wrap items-center">
    <div className="w-full md:w-1/2 flex justify-center md:justify-start">
      <div className="relative flex-grow transition-quick-pop home-community-image">
        <OptimizedImage
          src="/img/leaderboards/podium.webp"
          alt="The Best Community on Earth"
          width={382}
          height={411}
          className="w-85 h-auto"
          sizes="(min-width: 768px) 382px, 85vw"
        />
      </div>
    </div>

    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start md:flex-col-reverse">
      <div className="w-full">
        <div className="transition-fade md:-ml-[20px]">
          <OptimizedImage
            src="/img/degens/community-characters.webp"
            alt="Community DEGENs"
            width={596}
            height={194}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full h-auto pixelated"
          />
        </div>
      </div>

      <div className="w-full flex flex-col relative text-center md:text-left">
        <div className="purple-bg-orb orb-top-right" />
        <div className="w-full xl:mt-20">
          <h2 className="mb-3 section-title section-heading transition-vertical-fade">COMMUNITY</h2>
        </div>
        <p className="py-1 transition-vertical-fade">
          WE HATE TO BRAG, BUT OUR COMMUNITY IS TRULY TOP-NOTCH! JOIN OUR DISCORD TO CONNECT WITH
          OTHERS DEGENS &amp; HELP SHAPE NIFTY LEAGUE&apos;S FUTURE.
        </p>
        <ThemeButtonGroup
          className="md:justify-start"
          primary={{
            href: 'https://discord.gg/niftyleague',
            title: 'JOIN DISCORD',
            responsiveTitle: { mobile: 'DISCORD', desktop: 'JOIN DISCORD' },
            external: true,
          }}
          secondary={{ href: '/community', title: 'VIEW MORE' }}
        />
      </div>
    </div>
  </section>
)

const HomeSponsorsSection = () => (
  <section className="section w-screen relative text-center">
    <h2 className="my-3 lg:my-5 section-heading transition-vertical-fade">PROUDLY BACKED BY</h2>
    <DeferredSponsors />
    <ThemeButtonGroup
      primary={{ href: '/careers', title: 'JOIN THE TEAM' }}
      secondary={{
        href: '/blog',
        title: 'READ OUR BLOG',
        responsiveTitle: { mobile: 'READ BLOG', desktop: 'READ OUR BLOG' },
        external: true,
      }}
    />
  </section>
)

const ResponsiveLabel = ({ mobile, desktop }: { mobile: string; desktop: string }) => (
  <>
    <span className="responsive-label-mobile">{mobile}</span>
    <span className="responsive-label-desktop">{desktop}</span>
  </>
)

export {
  HomeCommunitySection,
  HomeCompeteSection,
  HomeDashboardSection,
  HomeDegensSection,
  HomeNiftyWorldSection,
  HomeSponsorsSection,
  HomeTokenSection,
}
