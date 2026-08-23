'use client'

import OptimizedImage from '@nl/ui/custom/optimized-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

export default function HomeCommunitySection() {
  return (
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
            <h2 className="mb-3 section-title section-heading transition-vertical-fade">
              COMMUNITY
            </h2>
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
}
