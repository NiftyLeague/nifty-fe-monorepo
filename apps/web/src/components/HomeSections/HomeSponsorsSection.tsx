import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

import Sponsors from '@/components/Sponsors'

export default function HomeSponsorsSection() {
  return (
    <section className="home-static-section section w-screen relative text-center">
      <h2 className="my-3 lg:my-5 section-heading transition-vertical-fade">PROUDLY BACKED BY</h2>
      <Sponsors />
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
}
