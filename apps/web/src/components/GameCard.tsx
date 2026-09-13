import OptimizedImage from '@nl/ui/custom/optimized-image'
import { cx } from '@nl/ui/class-names'

import type { NiftyGame } from '@/constants/games'
import styles from '@/app/(main)/games/index.module.css'

const GAME_ORB_POSITION_CLASSES = [
  'orb-bottom-left',
  'orb-top-right',
  'orb-bottom-right',
  'orb-top-left',
] as const

interface GameCardProps {
  game: NiftyGame
  index: number
  highlight?: boolean
  compact?: boolean
}

export default function GameCard({
  game,
  index,
  highlight = false,
  compact = false,
}: GameCardProps) {
  const { name, description, image, tag, link } = game
  const headingId = `game-card-${index}-heading`

  return (
    <article
      aria-labelledby={headingId}
      className={cx(
        styles.gameCard,
        compact
          ? 'flex flex-col relative'
          : 'flex flex-col-reverse md:flex-row items-center justify-center relative',
        highlight && styles.highlight,
        compact && styles.compact
      )}
      data-game-name={name}
    >
      <div className={cx(styles.copy, 'w-full', !compact && 'md:w-7/12 pr-0 md:pr-5')}>
        <div className="flex flex-row items-center justify-between mb-3">
          <h2 id={headingId} className="m-0 heading-look-4 whitespace-nowrap">
            <a
              className={styles.titleLink}
              href={link}
              target="_blank"
              rel="noreferrer"
              aria-label={`${name} (opens in a new tab)`}
            >
              {name}
            </a>
          </h2>
          <p className={cx(styles.tagGame, 'm-0')}>{tag}</p>
        </div>
        <p>{description}</p>
      </div>
      <div className={cx('w-full', !compact && 'md:w-5/12')}>
        <div className={styles.media}>
          <OptimizedImage
            src={image}
            alt={`${name} game artwork`}
            width={1280}
            height={720}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'low'}
            sizes="(min-width: 768px) 42vw, 100vw"
            className={styles.artwork}
          />
        </div>
      </div>
      <div
        className={cx(
          GAME_ORB_POSITION_CLASSES[index % GAME_ORB_POSITION_CLASSES.length],
          'purple-bg-orb'
        )}
      />
    </article>
  )
}
