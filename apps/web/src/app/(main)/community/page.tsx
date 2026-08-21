import type { NextPage } from 'next'

import OptimizedImage from '@nl/ui/custom/optimized-image'

import { DeferredCommunityConversation } from '@/components/DeferredCommunitySections'

import '@/styles/marketing.css'

import styles from './index.module.css'

const Community: NextPage = () => {
  return (
    <>
      <section className="relative min-h-screen">
        <div className="container pt-40 relative flex flex-col md:flex-row z-[2]">
          <div className="w-full md:w-1/2 px-0 text-center md:text-left">
            <h4 className="whitespace-nowrap">Nifty League</h4>
            <h2>Community</h2>
            <p className="mt-3">Meet our global community of gamers</p>
          </div>
          <div className="w-full sm:w-2/3 md:w-1/2 xl:w-1/3 relative mx-auto text-center">
            <div className="relative">
              <OptimizedImage
                src="/img/space/moon-satoshi.webp"
                alt="Satoshi moon"
                width={445}
                height={437}
                priority
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 67vw"
                className="w-full h-auto"
              />
            </div>
            <div className={styles.moon_grad}>
              <OptimizedImage
                src="/img/gradient/purple-light-grad.svg"
                alt="gradient background"
                width={685}
                height={685}
                sizes="685px"
              />
            </div>
            <div className="purple-bg-orb orb-top-right" />
          </div>
        </div>

        <div className="w-full h-auto absolute -bottom-10 md:-bottom-20">
          <div className="relative">
            <OptimizedImage
              src="/img/space/earth-darkened.webp"
              width={1684}
              height={525}
              alt="Earth"
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>
          <div className="dark-gradient-overlay" />
        </div>
        <span className={styles.earth_grad}>
          <OptimizedImage
            src="/img/gradient/purple-grad.svg"
            alt="Purple eclipse"
            width={704}
            height={704}
            sizes="(min-width: 769px) 80vw, 100vw"
            className="w-full h-auto"
          />
        </span>
      </section>

      <DeferredCommunityConversation />

      <section className="section flex sliding-nfts relative overflow-hidden">
        <div className="flex flex-col text-center relative p-0">
          <div className="relative sliding-background-wrapper">
            <div className="sliding-background" />
            <div className="dark-gradient-overlay" />
          </div>
        </div>
      </section>
    </>
  )
}

export default Community
