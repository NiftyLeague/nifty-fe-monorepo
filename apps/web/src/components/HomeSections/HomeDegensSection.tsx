import OptimizedImage from '@nl/ui/custom/optimized-image'

import { DEGEN_SITE_ASSETS_URL } from '@/constants/degen-assets'

import { DeferredHomeDegenCarousel } from '@/components/DeferredHomeMedia'
import ResponsiveLabel from '@/components/HomeSections/ResponsiveLabel'

export default function HomeDegensSection() {
  return (
    <section class="section w-screen relative flex flex-col text-center sliding-nfts">
      <h2 class="my-3 px-5 transition-vertical-fade whitespace-nowrap lg:my-5 sm:px-8">
        <ResponsiveLabel mobile="OWN YOUR AVATAR" desktop="COMMUNITY-GENERATED AVATARS" />
      </h2>

      <div class="relative pt-16 pb-8 px-0 mx-0 mb-12">
        <div class="absolute inset-0 mt-20 flex items-center justify-center z-10 pointer-events-none">
          <OptimizedImage
            class="pixelated w-full h-auto max-w-(--degens-overlay-max-w) md:max-w-(--degens-overlay-max-w-md) lg:max-w-175 xl:max-w-200"
            style={{ '--degens-overlay-max-w': '90vw', '--degens-overlay-max-w-md': '80%' }}
            src={`${DEGEN_SITE_ASSETS_URL}/nifty-ape.webp`}
            width={856}
            height={842}
            loading="lazy"
            alt="ape degen overlay"
            sizes="(max-width: 576px) 90vw, (max-width: 992px) 80%, 700px"
          />
        </div>
        <DeferredHomeDegenCarousel />
      </div>
    </section>
  )
}
