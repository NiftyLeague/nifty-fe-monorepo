import type { NextPage } from 'next'
import Image, { getImageProps } from 'next/image'

import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'
import { DeferredOverviewFAQ } from '@/components/DeferredOverviewSections'
import LearnCards from '@/components/LearnCards'

const Overview: NextPage = () => {
  const { props: desktopBackground } = getImageProps({
    alt: 'DGEN Network background',
    src: '/img/backgrounds/dgen-network.webp',
    width: 1440,
    height: 813,
    sizes: '100vw',
  })
  const { props: mobileBackground } = getImageProps({
    alt: 'DGEN Network background',
    src: '/img/backgrounds/dgen-network-mobile.webp',
    width: 375,
    height: 500,
    sizes: '100vw',
  })

  return (
    <>
      <div className="container relative pt-20">
      <div className="purple-bg-orb orb-top-right" />
      <section className="section relative">
        <h1 className="text-center">OVERVIEW</h1>
        <div className="mt-3">
          <p className="text-center">Learn how to navigate the Nifty League Platform</p>
        </div>
        <LearnCards />
        <div className="purple-bg-orb orb-bottom-left" />
        <div className="purple-bg-orb orb-bottom-right" />
      </section>

      <section className="section">
        <div className="text-center mb-5 relative">
          <h2>Frequently Asked Questions</h2>
          <div className="purple-bg-orb" style={{ left: 'calc(50% - 200px)', top: '100px' }} />
        </div>

        <DeferredOverviewFAQ />

        <ThemeBtnGroup
          className="mt-6 xl:mt-8"
          primary={{
            href: '/docs/faq/general',
            title: 'More FAQ',
            external: true,
            className: 'theme-btn-purple',
          }}
        />
      </section>
    </div>

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
    </>
  )
}

export default Overview
