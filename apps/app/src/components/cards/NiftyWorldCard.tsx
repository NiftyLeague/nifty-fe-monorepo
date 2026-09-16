import GameCard from './GameCard'

import styles from '@/pages/games/grid-item.module.css'

interface NiftyWorldCardProps {
  description: string
  href: string
  hoverActionLabel?: string
  image: string
  title: string
}

/** Shared full-bleed card treatment for Nifty World scenes and mini games. */
export default function NiftyWorldCard(props: NiftyWorldCardProps) {
  return (
    <div class={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
      <GameCard
        title={props.title}
        description={props.description}
        image={props.image}
        href={props.href}
        hoverActionLabel={props.hoverActionLabel ?? 'Explore map'}
        autoHeight
        overlayContent
        prefetch={false}
      />
    </div>
  )
}
