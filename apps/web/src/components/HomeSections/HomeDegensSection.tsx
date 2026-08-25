import OptimizedImage from '@nl/ui/custom/optimized-image'

import { DeferredHomeDegenCarousel } from '@/components/DeferredHomeMedia'
import ResponsiveLabel from '@/components/HomeSections/ResponsiveLabel'

export default function HomeDegensSection() {
  return (
    <section className="section w-screen relative flex flex-col text-center sliding-nfts">
      <h2 className="my-3 lg:my-5 px-5 sm:px-8 transition-vertical-fade">
        <ResponsiveLabel mobile="OWN YOUR AVATAR" desktop="COMMUNITY-GENERATED AVATARS" />
      </h2>

      <div className="relative pt-16 pb-8 px-0 mx-0 mb-12">
        <div className="absolute inset-0 mt-20 flex items-center justify-center z-10 pointer-events-none">
          <OptimizedImage
            className="pixelated w-full h-auto max-w-[90vw] md:max-w-[80%] lg:max-w-[700px] xl:max-w-[800px]"
            src="/img/degens/nifty-ape.webp"
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
