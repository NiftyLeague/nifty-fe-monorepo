import OptimizedImage from '@nl/ui/custom/optimized-image'
import ActionButtonsGroup from './ActionButtonsGroup'
import DeferredHeroBackground from './DeferredHeroBackground'
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

const Header = ({ activeModal }: { activeModal: ActiveModal }) => (
  <div className={styles.hero}>
    <DeferredHeroBackground />
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
        <ActionButtonsGroup activeModal={activeModal} />
      </div>
    </div>
  </div>
)

export default Header
