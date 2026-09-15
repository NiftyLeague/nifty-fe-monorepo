import type { JSX } from 'solid-js'
import { COMMUNITY_DEGEN_LIST } from '@/constants/degens'
import { RenderDegen } from '@/components/Carousel/DegenCardItem'
import styles from './CommunityDegenCarousel.module.css'

/**
 * Endless marquee for the community avatar strip. The list renders twice in a
 * track that translates -50% and loops, so the scroll is continuous with no
 * page-flip jumps. It keeps moving while hovered so the strip never appears
 * stuck; reduced-motion users get a plain scrollable row instead.
 */
export default function CommunityDegenCarousel() {
  return (
    <div class={styles.marquee} aria-label="Community DEGENs">
      <div
        class={styles.track}
        style={{ '--marquee-duration': `${COMMUNITY_DEGEN_LIST.length * 3}s` } as JSX.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div class={styles.group} aria-hidden={copy === 1}>
            {COMMUNITY_DEGEN_LIST.map((degen) => (
              <div class={styles.item}>{RenderDegen(degen)}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
