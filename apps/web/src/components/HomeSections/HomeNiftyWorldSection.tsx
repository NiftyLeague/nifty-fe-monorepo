import OptimizedImage from '@nl/ui/custom/optimized-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

import { NIFTY_WORLD_APP_URL } from '@/constants/links'

export default function HomeNiftyWorldSection() {
  return (
    <section class="home-static-section container section relative flex flex-row flex-wrap items-center">
      <div class="w-full md:w-1/2">
        <div class="transition-fade">
          <OptimizedImage
            src="/img/logos/niftyworld/app_logo.webp"
            alt="Land in Nifty World"
            width={612}
            height={482}
            loading="lazy"
            sizes="(min-width: 768px) 50vw, 100vw"
            class="w-full h-auto"
          />
        </div>
      </div>
      <div class="w-full md:w-1/2 relative pl-0 md:pl-6">
        <div class="purple-bg-orb orb-top-right" />
        <div class="flex flex-col relative items-center md:items-start">
          <h2 class="mb-3 section-title section-heading transition-vertical-fade">
            DISCOVER
            <br />
            <span class="whitespace-nowrap font-default font-normal text-highlight-purple">
              NIFTY WORLD
            </span>
          </h2>
          <p class="my-0 py-1 lg:py-3 section-description transition-vertical-fade">
            A VIRTUAL SOCIAL HUB LIKE NONE OTHER FOR GAMERS.
          </p>
          <ThemeButtonGroup
            class="md:justify-start"
            primary={{ href: NIFTY_WORLD_APP_URL, title: 'EXPLORE', external: true }}
            secondary={{
              href: '/docs/overview/games/niftyworld',
              title: 'VIEW DOCS',
              external: true,
            }}
          />
        </div>
      </div>
    </section>
  )
}
