import Image from 'next/image'
import Script from 'next/script'

import styles from './index.module.css'

const POSTER_BACKGROUND = '/img/games/smashers/smashers-poster.jpg'
const DeferredHeroBackground = () => {
  return (
    <>
      <Script src="/scripts/smashers-hero-animation.js" strategy="lazyOnload" />
      <picture className={styles.heroBackground}>
        <Image
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
