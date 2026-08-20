'use client'

import { memo, useRef, useState, useCallback, useEffect } from 'react'
import { Button } from '@nl/ui/base/button'
import { cx } from '@nl/ui/class-names'
import OptimizedImage from '@nl/ui/custom/optimized-image'
import { ParallaxWrapper } from '@nl/ui/custom/parallax-wrapper'

import styles from './index.module.css'

const CONSOLE_ARTWORK_DIMENSIONS = {
  width: 4842,
  height: 3371,
  sizes: '100vw',
} as const

export interface ConsoleGameProps {
  isNearViewport?: boolean
  src: string
}

export const ConsoleGame = memo(function ConsoleGame({
  isNearViewport = true,
  src,
}: ConsoleGameProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play().catch((error) => {
        console.error('Play failed:', error)
      })
    } else {
      videoRef.current.pause()
    }
  }, [])

  const handlePlay = useCallback(() => setIsPlaying(true), [])
  const handlePause = useCallback(() => setIsPlaying(false), [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isNearViewport) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [isNearViewport])

  return (
    <div className="relative overflow-hidden">
      <div
        style={{ position: 'relative', display: 'flex', flexGrow: 1 }}
        className="md:animation-hidden"
      >
        <OptimizedImage
          alt="Game Console Backdrop"
          className="pixelated"
          {...CONSOLE_ARTWORK_DIMENSIONS}
          src="/img/console-game/classic-gaming-reinvented-notv.webp"
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
        />
        <video
          ref={videoRef}
          id="console-video"
          width="100%"
          height="100%"
          muted
          autoPlay={isNearViewport}
          loop
          playsInline
          preload={isNearViewport ? 'metadata' : 'none'}
          className={styles.game_video}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handlePause}
        >
          <source src={src} type="video/mp4" />
        </video>
        <Button
          type="button"
          onClick={togglePlay}
          variant="ghost"
          size="icon"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className={cx(styles.bonk_note, 'h-auto w-auto rounded-none p-0 hover:bg-transparent')}
        >
          <OptimizedImage
            alt="Bonk Sticker"
            className="pixelated"
            {...CONSOLE_ARTWORK_DIMENSIONS}
            src="/img/console-game/bonk.webp"
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </Button>
      </div>
      <div className={styles.gaming_controller}>
        <ParallaxWrapper parallaxDirection="down" parallaxIntensity="normal">
          <div className="animate-hover transition-fade">
            <OptimizedImage
              alt="Controller Left"
              className="pixelated"
              {...CONSOLE_ARTWORK_DIMENSIONS}
              src="/img/console-game/gaming_controller_left.webp"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </ParallaxWrapper>
      </div>
      <div className={styles.gaming_controller}>
        <ParallaxWrapper parallaxDirection="down" parallaxIntensity="normal">
          <div className="animate-hover transition-fade">
            <OptimizedImage
              alt="Controller Right"
              className="pixelated"
              {...CONSOLE_ARTWORK_DIMENSIONS}
              src="/img/console-game/gaming_controller_right.webp"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </ParallaxWrapper>
      </div>
      <div className="dark-gradient-overlay" />
    </div>
  )
})

export default ConsoleGame
