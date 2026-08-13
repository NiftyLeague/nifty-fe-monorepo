'use client'

import Carousel from '@/components/Carousel'
import { RenderDegen } from '@/components/Carousel/DegenCardItem'
import { COMMUNITY_DEGEN_LIST } from '@/constants/degens'

export default function CommunityDegenCarousel() {
  return (
    <Carousel mobileItems={2} ariaLabel="Community DEGENs">
      {COMMUNITY_DEGEN_LIST.map(RenderDegen)}
    </Carousel>
  )
}
