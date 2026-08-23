'use client'

import OptimizedImage from '@nl/ui/custom/optimized-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

export default function HomeNiftyWorldSection() {
  return (
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
}
