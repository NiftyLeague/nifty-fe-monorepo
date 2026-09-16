import OptimizedImage from '@nl/ui/custom/optimized-image'

import { NIFTYWORLD_PROPERTIES } from '@/constants/niftyworld'

export default function NiftyWorldProperties() {
  return (
    <section class="section relative">
      <div class="purple-bg-orb orb-top-left" />
      <div class="mb-3">
        <h2 class="text-center heading-look-3 text-highlight-purple">
          PROPERTY TYPES FOR EVERYONE
        </h2>
      </div>
      <div class="flex flex-col items-start md:flex-row w-full justify-between flex-wrap">
        {NIFTYWORLD_PROPERTIES.map(({ name, description, image }) => (
          <div class="w-full md:w-1/2 flex flex-col lg:flex-row relative py-3 px-2 mb-3 md:mb-5">
            <div class="w-full lg:w-1/2 lg:pr-2 flex flex-col">
              <h3 class="my-0 heading-look-6">{name}</h3>
              <p class="mt-2 md:mt-4 mb-4 lg:mb-0">{description}</p>
            </div>
            <div class="w-full lg:w-1/2 lg:pl-2 relative">
              <div>
                <OptimizedImage
                  src={image}
                  alt="Nifty World District Highlight"
                  width={500}
                  height={283}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  class="w-full h-auto max-w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
