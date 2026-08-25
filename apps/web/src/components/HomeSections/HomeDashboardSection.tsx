import OptimizedImage from '@nl/ui/custom/optimized-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

import { DEGEN_COLLECTION_URL } from '@/constants/degen-assets'

export default function HomeDashboardSection() {
  return (
    <section className="home-static-section section w-screen relative">
      <div className="relative flex-grow transition-fade">
        <OptimizedImage
          src="/img/misc/dashboard.webp"
          alt="App Dashboard"
          width={1920}
          height={1172}
          loading="lazy"
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
}
