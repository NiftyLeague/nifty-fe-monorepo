import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadCommunityDegenCarousel = () => import('@/components/CommunityDegenCarousel')

export function DeferredHomeDegenCarousel() {
  return (
    <DeferredSection
      label="community DEGEN carousel"
      load={loadCommunityDegenCarousel}
      minHeightClassName="min-h-[22rem]"
    />
  )
}
