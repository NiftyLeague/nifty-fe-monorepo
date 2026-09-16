import OptimizedImage from '@nl/ui/custom/optimized-image'

import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'
import { LEARN_CARDS } from './constants'

interface LearnCardProps {
  btnText: string
  eager?: boolean
  external?: boolean
  image: string
  link: string
  priority?: boolean
  subtitle: string
  title: string
}

const LearnCard = ({
  btnText,
  eager = false,
  external,
  image,
  link,
  priority = false,
  subtitle,
  title,
}: LearnCardProps) => {
  return (
    <div class="relative flex items-center w-full h-full rounded-2xl overflow-hidden">
      <div class="absolute inset-0">
        <div>
          <OptimizedImage
            alt={`${title} card background`}
            priority={priority}
            src={image}
            width={552}
            height={310}
            {...(eager ? { loading: 'eager' as const } : {})}
            sizes="(min-width: 640px) 50vw, 100vw"
            class="object-cover w-full h-auto"
          />
        </div>
      </div>

      <div class="relative w-full h-full flex flex-col items-center justify-center p-3 md:p-4 lg:p-5 text-center z-10">
        <div class="mb-4 md:mb-6">
          <h2 class="text-center uppercase text-xl font-bold heading-look-5 text-highlight-purple">
            {title}
          </h2>
        </div>
        <div class="mb-0">
          <p class="text-center">{subtitle}</p>
        </div>
        <ThemeBtnGroup
          primary={{
            href: link,
            title: (
              <>
                {btnText}
                <span class="sr-only"> about {title}</span>
              </>
            ),
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
    <div class="flex flex-wrap -mx-1 sm:-mx-2 pt-3 lg:pt-5 lg:mt-3">
      {LEARN_CARDS.map(({ btnText, external, image, link, subtitle, title }, index) => (
        <div class="w-full sm:w-1/2 p-2">
          <LearnCard
            btnText={btnText}
            eager={index < 4}
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
