import type { JSX } from 'solid-js'
import { Check, X } from 'lucide-solid'

import { cx } from '@nl/ui/class-names'
import OptimizedImage from '@nl/ui/custom/optimized-image'
import { AnimatedImage } from '@nl/ui/custom/animated-image'
import { DeferredAnimatedImage } from '@nl/ui/custom/deferred-animated-image'
import styles from './index.module.css'

export type RoadmapCardSide = 'left' | 'right'

export const getRoadmapCardSide = (index: number): RoadmapCardSide =>
  index % 2 === 0 ? 'left' : 'right'

interface RoadmapCardProps {
  body: JSX.Element
  cancelled?: boolean
  current?: boolean
  completed?: boolean
  completionDate?: string
  divider?: boolean
  image?: {
    src: string
    posterSrc?: string
    width: number
    height: number
    style: { top: string; right?: string }
  }
  side?: RoadmapCardSide
  title: string | JSX.Element
}

const RoadmapCard = ({
  body,
  cancelled,
  current,
  completed,
  completionDate,
  divider,
  image,
  side = 'left',
  title,
}: RoadmapCardProps): JSX.Element => (
  <div
    class={cx(styles.cd_timeline_block, styles.fade_in)}
    data-roadmap-card
    data-roadmap-status={
      cancelled ? 'cancelled' : completed ? 'completed' : current ? 'current' : 'planned'
    }
    data-roadmap-title={typeof title === 'string' ? title : undefined}
    data-timeline-side={side}
  >
    {divider ? (
      <h4 class={styles.cd_timeline_divider}>Options below are TBD!</h4>
    ) : (
      <div
        class={cx(styles.cd_timeline_checkpoint, {
          [styles.completed as string]: completed,
          [styles.cancelled as string]: cancelled,
        })}
      >
        {completed && (
          <Check
            absoluteStrokeWidth
            aria-hidden="true"
            class="m-auto"
            size={20}
            stroke-width={2.5}
          />
        )}
        {cancelled && (
          <X absoluteStrokeWidth aria-hidden="true" class="m-auto" size={20} stroke-width={2.5} />
        )}
      </div>
    )}

    {image && (
      <div class={styles.timeline_content_img} style={image.style}>
        {image.src.endsWith('.gif') && image.posterSrc ? (
          <DeferredAnimatedImage
            src={image.posterSrc}
            animatedSrc={image.src}
            animatedType="image/gif"
            alt={`${title?.toString()}`}
            width={image.width}
            height={image.height}
            sizes="200px"
            style={{ width: '100%', height: 'auto' }}
          />
        ) : image.src.endsWith('.gif') || image.posterSrc ? (
          <AnimatedImage
            src={image.src}
            animatedSrc={image.posterSrc}
            animatedType="image/webp"
            unoptimized={image.src.includes('gif')}
            alt={`${title?.toString()}`}
            width={image.width}
            height={image.height}
            sizes="200px"
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <OptimizedImage
            src={image.src}
            alt={`${title?.toString()}`}
            width={image.width}
            height={image.height}
            sizes="200px"
            loading="lazy"
            fetchpriority="low"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </div>
    )}

    <div class={styles.cd_timeline_content}>
      <div class={styles.timeline_content_body}>
        <h3 class="[word-spacing:-10px] heading-look-5 text-highlight-purple">{title}</h3>
        {(completed || cancelled) && (
          <div class={styles.timeline_content_info}>
            <span class={styles.timeline_content_info_title}>
              {cancelled ? 'Cancelled' : 'Mission Accomplished'}
            </span>
            <span class={styles.timeline_content_info_date}>{completionDate}</span>
          </div>
        )}
        {body}
      </div>
    </div>

    {current ? (
      <div class={styles.satoshiStationary}>
        <OptimizedImage
          src="/img/space/satoshi_stationary.gif"
          unoptimized
          alt="satoshi stationary"
          width={200}
          height={200}
          sizes="(min-width: 1170px) 250px, (min-width: 1000px) 200px, (min-width: 850px) 175px, 125px"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    ) : null}
  </div>
)

export default RoadmapCard
