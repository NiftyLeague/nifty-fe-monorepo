import OptimizedImage from '@nl/ui/custom/optimized-image'
import { SOCIALS } from './constants'

interface SocialProps {
  link: string
  title: string
  subtitle: string
  image: string
}

const SocialCard = ({ link, title, subtitle, image }: SocialProps) => (
  <a href={link} target="_blank" rel="noreferrer">
    <div class="social-card-gradient h-full p-4 sm:p-6 rounded-lg flex">
      <div class="mr-4 flex-1 flex flex-col">
        <h4 class="text-highlight-purple text-lg font-medium mb-1">{title}</h4>
        <p class="text-foreground text-sm sm:text-base">{subtitle}</p>
      </div>
      <div class="shrink-0 flex items-center">
        <OptimizedImage
          alt={`${title} icon`}
          src={image}
          width={40}
          height={40}
          class="object-contain"
        />
      </div>
    </div>
  </a>
)

const SocialCards = () => {
  // Split SOCIALS into pairs for each row
  const rows = []
  for (let i = 0; i < SOCIALS.length; i += 2) {
    rows.push(SOCIALS.slice(i, i + 2))
  }

  return (
    <div class="container mx-auto px-4 mt-5 max-w-6xl">
      <div class="flex flex-col gap-4">
        {rows.map((row) => (
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {row.map(({ link, title, subtitle, image }) => (
              <SocialCard link={link} title={title} subtitle={subtitle} image={image} />
            ))}
            {/* Add empty div to maintain grid when there's an odd number of items */}
            {row.length === 1 && <div class="hidden lg:block" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SocialCards
