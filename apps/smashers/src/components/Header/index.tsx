import type { JSX } from 'solid-js'
import OptimizedImage from '@nl/ui/custom/optimized-image'
import Navbar from './Navbar'

import styles from './index.module.css'

/**
 * Above-the-fold artwork the page preloads. These are the exact props the
 * header renders, so the preload hint resolves to the same optimizer variant
 * the <img> requests instead of downloading the artwork twice.
 */
export const HERO_ARTWORK = [
  {
    src: '/img/logos/smashers/app_wordmark_logo.webp',
    width: 824,
    // The CSS box is `width: 400px; max-width: 70vw` (index.module.css) — the
    // sizes must describe that box, not the intrinsic width, or the browser
    // downloads a rung twice the size it renders.
    sizes: '(max-width: 571px) 70vw, 400px',
    quality: 85,
  },
] as const
const HERO_WORDMARK = HERO_ARTWORK[0]

const Header = ({
  heroBackground,
  actionButtons,
}: {
  heroBackground?: JSX.Element
  actionButtons?: JSX.Element
}) => (
  <div class={styles.hero}>
    {heroBackground}
    <div class="dark-gradient-overlay !h-screen" />
    <div class={styles.heroContainer}>
      <Navbar />
      <div class={styles.heroContent}>
        <OptimizedImage
          src={HERO_WORDMARK.src}
          alt="Wordmark Logo"
          class={styles.wordmark}
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
