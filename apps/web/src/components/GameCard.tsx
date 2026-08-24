import { DeferredYouTubeEmbed } from '@nl/ui/custom/deferred-youtube-embed'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'
import { cx } from '@nl/ui/class-names'
import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'

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
}

export default function GameCard({ game, index }: GameCardProps) {
  const { name, description, video, tag, action } = game

  return (
    <article className="flex flex-col-reverse md:flex-row relative mb-8">
      <div className={cx(styles.block, 'w-full md:w-7/12 pr-0 md:pr-5')}>
        <div className="flex flex-row items-center justify-between mb-3">
          <h4 className="m-0">{name}</h4>
          <p className={cx(styles.tagGame, 'm-0')}>{tag}</p>
        </div>
        <p>{description}</p>
        <div className="flex justify-center md:justify-start mt-4">
          {action.isComingSoon ? (
            <ThemeBtnGroup
              className="justify-start mt-3 xl:mt-3"
              primary={{
                title: 'COMING SOON',
                disabled: true,
                className: 'theme-btn-rounded max-w-fit',
              }}
            />
          ) : null}

          {action.link && action.title ? (
            <ThemeBtnGroup
              className="justify-start mt-3 xl:mt-3"
              primary={{
                href: action.link,
                title: action.title,
                external: action.link.includes('http'),
                className: 'theme-btn-rounded max-w-fit',
              }}
              secondary={
                action.secondaryLink && action.secondaryTitle
                  ? {
                      href: action.secondaryLink,
                      title: action.secondaryTitle,
                      external: action.secondaryLink.includes('http'),
                      className: 'theme-btn-rounded max-w-fit ml-3',
                    }
                  : undefined
              }
            />
          ) : null}
        </div>
      </div>
      <div className="w-full md:w-5/12">
        <div className="relative text-right mb-4">
          {video.includes('youtube') ? (
            <DeferredYouTubeEmbed src={video} title={name} className={styles.video} />
          ) : (
            <ViewportVideo
              id={`game-video-${index}`}
              deferLoad
              width="100%"
              height="100%"
              muted
              loop
              playsInline
              data-keepplaying
              className={styles.video}
              src={video}
            />
          )}
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
