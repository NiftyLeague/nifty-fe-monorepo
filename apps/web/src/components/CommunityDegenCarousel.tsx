'use client'

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
    <div className={styles.marquee} aria-label="Community DEGENs">
      <div
        className={styles.track}
        style={
          { '--marquee-duration': `${COMMUNITY_DEGEN_LIST.length * 3}s` } as React.CSSProperties
        }
      >
        {[0, 1].map((copy) => (
          <div className={styles.group} key={copy} aria-hidden={copy === 1}>
            {COMMUNITY_DEGEN_LIST.map((degen) => (
              <div className={styles.item} key={`${copy}-${degen.name}`}>
                {RenderDegen(degen)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
