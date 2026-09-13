import GameCard from './GameCard'

import styles from '@/pages/games/grid-item.module.css'

interface NiftyWorldCardProps {
  description: string
  href: string
  image: string
  title: string
}

/** Shared full-bleed card treatment for Nifty World scenes and mini games. */
export default function NiftyWorldCard({ description, href, image, title }: NiftyWorldCardProps) {
  return (
    <div className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
      <GameCard
        title={title}
        description={description}
        image={image}
        href={href}
        autoHeight
        overlayContent
        prefetch={false}
      />
    </div>
  )
}
