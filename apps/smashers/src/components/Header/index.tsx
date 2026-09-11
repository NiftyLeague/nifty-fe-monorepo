import OptimizedImage from '@nl/ui/custom/optimized-image'
import Navbar from './Navbar'

import styles from './index.module.css'

export type ActiveModal = 'credits' | 'play' | 'trailer' | 'unity' | null

/**
 * Above-the-fold artwork the page preloads. These are the exact props the
 * header renders, so the preload hint resolves to the same optimizer variant
 * the <img> requests instead of downloading the artwork twice.
 */
export const HERO_ARTWORK = [
  {
    src: '/img/logos/smashers/app_wordmark_logo.webp',
    width: 824,
    sizes: '(max-width: 768px) 100vw, 824px',
    quality: 85,
  },
] as const
const HERO_WORDMARK = HERO_ARTWORK[0]

interface HeaderProps {
  /**
   * Interactive subtrees, injected as Astro `slot` fragments.
   *
   * They must arrive from the page rather than being imported here: this
   * component renders server-side as plain HTML, so a child imported directly
   * would ship without a `client:*` directive and never hydrate — which is
   * exactly how the hero animation and the Play/Trailer/Credits buttons ended
   * up inert. Passing them in lets the page attach the directives and keeps the
   * static shell (nav, wordmark) free of JavaScript.
   */
  heroBackground?: React.ReactNode
  actionButtons?: React.ReactNode
}

const Header = ({ heroBackground, actionButtons }: HeaderProps) => (
  <div className={styles.hero}>
    {heroBackground}
    <div className="dark-gradient-overlay !h-screen" />
    <div className={styles.heroContainer}>
      <Navbar />
      <div className={styles.heroContent}>
        <OptimizedImage
          src={HERO_WORDMARK.src}
          alt="Wordmark Logo"
          className={styles.wordmark}
          width={824}
          height={572}
          priority
          sizes={HERO_WORDMARK.sizes}
          quality={HERO_WORDMARK.quality}
        />
        {actionButtons}
      </div>
    </div>
  </div>
)

export default Header
