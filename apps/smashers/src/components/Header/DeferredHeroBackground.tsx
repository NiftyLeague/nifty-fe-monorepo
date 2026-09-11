import DeferredExternalScript from '@nl/ui/custom/deferred-external-script'
import OptimizedImage from '@nl/ui/custom/optimized-image'

import styles from './index.module.css'

/** Decorative hero backdrop; the page preloads the wordmark as the LCP candidate. */
export const HERO_BACKGROUND = '/img/games/smashers/background-poster.webp'
const DeferredHeroBackground = () => {
  return (
    <>
      <DeferredExternalScript
        id="smashers-hero-animation"
        src="/scripts/smashers-hero-animation.js"
      />
      <picture className={styles.heroBackground}>
        <OptimizedImage
          src={HERO_BACKGROUND}
          alt=""
          fill
          sizes="100vw"
          // Decorative backdrop, and four times the size of the wordmark that
          // is the actual LCP element. Starting it eagerly but at low priority
          // keeps it painted early without competing for bandwidth with the
          // wordmark, which the page preloads at high priority instead.
          loading="eager"
          fetchPriority="low"
          className={styles.heroBackgroundImage}
          decoding="async"
          data-smashers-hero-background
        />
      </picture>
    </>
  )
}

export default DeferredHeroBackground
