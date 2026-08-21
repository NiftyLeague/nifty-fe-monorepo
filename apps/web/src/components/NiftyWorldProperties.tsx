'use client'

import OptimizedImage from '@nl/ui/custom/optimized-image'
import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'

import { NIFTYWORLD_PROPERTIES } from '@/constants/niftyworld'

export default function NiftyWorldProperties() {
  return (
    <section className="section relative">
      <div className="purple-bg-orb orb-top-left" />
      <div className="mb-3 mb-md-5">
        <h3 className="text-center">PROPERTY TYPES FOR EVERYONE</h3>
      </div>
      <div className="flex flex-col items-start md:flex-row w-full justify-between flex-wrap">
        {NIFTYWORLD_PROPERTIES.map(({ name, description, image }) => (
          <div
            className="w-full md:w-1/2 flex flex-col lg:flex-row relative py-3 px-2 mb-3 md:mb-5"
            key={name}
          >
            <div className="w-full lg:w-1/2 lg:pr-2 flex flex-col">
              <h6 className="my-0">{name}</h6>
              <p className="mt-2 md:mt-4 mb-4 lg:mb-0">{description}</p>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-2 relative">
              <div>
                <OptimizedImage
                  src={image}
                  alt="NiftyWorld District Highlight"
                  width={500}
                  height={283}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <ThemeBtnGroup
        primary={{
          href: '/docs/overview/games/niftyworld',
          title: 'VIEW DOCS',
          external: true,
        }}
      />
    </section>
  )
}
