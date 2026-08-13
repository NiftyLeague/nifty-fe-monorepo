import Image from 'next/image'

import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'
import { LEARN_CARDS } from './constants'

interface LearnCardProps {
  btnText: string
  external?: boolean
  image: string
  link: string
  priority?: boolean
  subtitle: string
  title: string
}

const LearnCard = ({
  btnText,
  external,
  image,
  link,
  priority = false,
  subtitle,
  title,
}: LearnCardProps) => {
  return (
    <div className="relative flex items-center w-full h-full rounded-2xl overflow-hidden">
      <div className="absolute inset-0">
        <div>
          <Image
            alt={`${title} card background`}
            priority={priority}
            src={image}
            width={552}
            height={310}
            sizes="(min-width: 640px) 50vw, 100vw"
            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div className="relative w-full h-full flex flex-col items-center justify-center p-3 md:p-4 lg:p-5 text-center z-10">
        <div className="mb-4 md:mb-6">
          <h5 className="text-center uppercase text-xl font-bold">{title}</h5>
        </div>
        <div className="mb-0">
          <p className="text-center">{subtitle}</p>
        </div>
        <ThemeBtnGroup
          primary={{
            href: link,
            title: btnText,
            external: external,
            className: 'theme-btn-rounded max-w-fit',
          }}
        />
      </div>
    </div>
  )
}

const LearnCards = () => {
  return (
    <div className="flex flex-wrap -mx-1 sm:-mx-2 pt-3 lg:pt-5 lg:mt-3">
      {LEARN_CARDS.map(({ btnText, external, image, link, subtitle, title }, index) => (
        <div key={title} className="w-full sm:w-1/2 p-2">
          <LearnCard
            btnText={btnText}
            external={external}
            image={image}
            link={link}
            priority={index === 0}
            subtitle={subtitle}
            title={title}
          />
        </div>
      ))}
    </div>
  )
}

export default LearnCards
