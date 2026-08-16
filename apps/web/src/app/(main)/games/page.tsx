import type { NextPage } from 'next'

import OptimizedImage from '@nl/ui/custom/optimized-image'

import { LazyYouTubeEmbed } from '@nl/ui/custom/lazy-youtube-embed'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'
import { cx } from '@nl/ui/class-names'

import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'
import { NIFTY_GAMES } from '@/constants/games'
import styles from './index.module.css'

const Games: NextPage = () => (
  <div className="container relative pt-20">
    <div className="purple-bg-orb orb-top-right" />
    <section className="section flex items-center justify-center flex-wrap">
      <div className="w-1/3 md:w-1/2 md:px-2 lg:px-3">
        <div className="animate-zoom-out">
          <ViewportVideo
            id="lobby"
            width="100%"
            height="100%"
            muted
            loop
            playsInline
            data-keepplaying
            className="hidden md:block"
            src="/video/lobby.mp4"
          />
          <div className="block md:hidden">
            <OptimizedImage
              alt="Arcade"
              width={339}
              height={661}
              src="/img/games/smashers/arcade.webp"
              sizes="33vw"
              style={{ width: '100%', height: 'auto', marginBottom: '6rem' }}
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 px-2 lg:px-3">
        <div className="mb-4">
          <h1 className="text-center whitespace-nowrap">GAMES</h1>
        </div>
        <div className="mb-5">
          <p className="text-center">
            Join thousands of players around the world competing for the top spot in Nifty
            League!{' '}
          </p>
        </div>
      </div>
    </section>

    <section className="section">
      {NIFTY_GAMES.map(({ name, description, video, tag, action }, index) => (
        <article className="flex flex-col-reverse md:flex-row relative mb-8" key={name}>
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
                <LazyYouTubeEmbed src={video} title={name} className={styles.video} />
              ) : (
                <ViewportVideo
                  id={`game-video-${index}`}
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
              index === 0
                ? 'orb-bottom-left'
                : index === 1
                  ? 'orb-top-right'
                  : styles.gradient_custom,
              'purple-bg-orb'
            )}
          />
        </article>
      ))}

      <ThemeBtnGroup
        className="mt-6 xl:mt-8"
        primary={{
          href: '/docs/guides/nifty-smashers/general-info',
          title: 'VIEW DOCS',
          external: true,
        }}
      />
    </section>
  </div>
)

export default Games
