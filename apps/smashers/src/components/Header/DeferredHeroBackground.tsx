'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './index.module.css'

const ANIMATED_BACKGROUND = '/img/games/smashers/background.webp'
const FALLBACK_BACKGROUND = '/img/games/smashers/background.gif'
const POSTER_BACKGROUND = '/img/games/smashers/smashers-poster.jpg'

type IdleWindow = Window & {
  cancelIdleCallback?: (handle: number) => void
  requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number
}

const scheduleAnimationLoad = (callback: () => void) => {
  const idleWindow = window as IdleWindow

  if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
    const handle = idleWindow.requestIdleCallback(callback, { timeout: 2_000 })

    return () => idleWindow.cancelIdleCallback?.(handle)
  }

  const handle = window.setTimeout(callback, 1_200)

  return () => window.clearTimeout(handle)
}

const DeferredHeroBackground = () => {
  const [animationReady, setAnimationReady] = useState(false)

  useEffect(() => {
    let mounted = true

    const cancelScheduledLoad = scheduleAnimationLoad(() => {
      const preload = new window.Image()
      preload.decoding = 'async'
      preload.onload = () => {
        if (mounted) setAnimationReady(true)
      }
      preload.onerror = () => {
        if (mounted) setAnimationReady(true)
      }
      preload.src = ANIMATED_BACKGROUND
    })

    return () => {
      mounted = false
      cancelScheduledLoad()
    }
  }, [])

  return (
    <picture className={styles.heroBackground}>
      {animationReady && <source type="image/webp" srcSet={ANIMATED_BACKGROUND} />}
      <Image
        src={animationReady ? FALLBACK_BACKGROUND : POSTER_BACKGROUND}
        alt=""
        fill
        unoptimized
        sizes="100vw"
        priority
        className={styles.heroBackgroundImage}
        decoding="async"
      />
    </picture>
  )
}

export default DeferredHeroBackground
