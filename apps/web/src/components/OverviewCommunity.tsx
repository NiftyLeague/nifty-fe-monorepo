import { getOptimizedImageProps } from '@nl/ui/custom/optimized-image'
import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'

export default function OverviewCommunity() {
  const desktopBackground = getOptimizedImageProps({
    alt: 'DGEN Network background',
    src: '/img/backgrounds/dgen-network.webp',
    width: 1440,
    height: 813,
    sizes: '100vw',
  })
  const mobileBackground = getOptimizedImageProps({
    alt: 'DGEN Network background',
    src: '/img/backgrounds/dgen-network-mobile.webp',
    width: 375,
    height: 500,
    sizes: '100vw',
  })

  return (
    <section className="section relative w-full">
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileBackground.srcSet} />
        <img
          {...desktopBackground}
          alt="DGEN Network background"
          className="pixelated"
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </picture>
      <div className="dark-gradient-overlay" />
      <div className="w-full h-auto absolute top-0 text-center flex items-center flex-col mt-40 md:mt-10 lg:mt-20">
        <h2 className="mt-4">Stay in the loop</h2>
        <p className="my-3 px-4 text-center">
          Meet our community and stay up to date with our roadmap or team updates
        </p>
        <ThemeBtnGroup
          className="mt-2 xl:mt-2"
          primary={{
            href: 'https://discord.gg/niftyleague',
            title: 'JOIN DISCORD',
            external: true,
          }}
        />
      </div>
    </section>
  )
}
