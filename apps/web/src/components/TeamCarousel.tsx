'use client'

import Carousel from '@/components/Carousel'
import TeamCardItem from '@/components/Carousel/TeamCardItem'
import { CORE_TEAM, DEGEN_DELEGATES } from '@/constants/team'

export default function TeamCarousel() {
  return (
    <Carousel isMobileViewOnly hideGradient tabletItems={2} ariaLabel="Nifty League team">
      {[...CORE_TEAM, ...DEGEN_DELEGATES].map((item) => (
        <TeamCardItem key={item.name} {...item} />
      ))}
    </Carousel>
  )
}
