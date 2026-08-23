'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

const loadSponsors = () => import('@/components/Sponsors')

function DeferredSponsors() {
  return <DeferredSection label="sponsors" load={loadSponsors} minHeightClassName="min-h-[22rem]" />
}

export default function HomeSponsorsSection() {
  return (
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
}
