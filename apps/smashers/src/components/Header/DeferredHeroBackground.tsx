import DeferredExternalScript from '@nl/ui/custom/deferred-external-script'
import OptimizedImage from '@nl/ui/custom/optimized-image'

import styles from './index.module.css'

const POSTER_BACKGROUND = '/img/games/smashers/smashers-poster.jpg'
const DeferredHeroBackground = () => {
  return (
    <>
      <DeferredExternalScript
        id="smashers-hero-animation"
        src="/scripts/smashers-hero-animation.js"
      />
      <picture className={styles.heroBackground}>
        <OptimizedImage
          src={POSTER_BACKGROUND}
          alt=""
          fill
          sizes="100vw"
          priority
          className={styles.heroBackgroundImage}
          decoding="async"
          data-smashers-hero-background
        />
      </picture>
    </>
  )
}

export default DeferredHeroBackground
