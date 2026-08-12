'use client'

import Image from 'next/image'
import { memo, useRef, useState, useCallback, useEffect } from 'react'
import { Button } from '@nl/ui/base/button'
import { ParallaxWrapper } from '@nl/ui/custom/parallax-wrapper'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import { cn } from '@nl/ui/utils'

import styles from './index.module.css'

export const ConsoleGame = memo(function ConsoleGame({ src }: { src: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isNearViewport = useOnScreen(rootRef, '200px')

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
    <div ref={rootRef} className="relative overflow-hidden">
      <div
        style={{ position: 'relative', display: 'flex', flexGrow: 1 }}
        className="md:animation-hidden"
      >
        <Image
          alt="Game Console Backdrop"
          className="pixelated"
          width={1920}
          height={1080}
          src="/img/console-game/classic-gaming-reinvented-notv.webp"
          sizes="(max-width: 1920px) 100vw, 1920px"
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          loading="lazy"
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
          className={cn(styles.bonk_note, 'h-auto w-auto rounded-none p-0 hover:bg-transparent')}
        >
          <Image
            alt="Bonk Sticker"
            className="pixelated"
            width={1920}
            height={1080}
            src="/img/console-game/bonk.webp"
            loading="lazy"
            sizes="(max-width: 1920px) 100vw, 1920px"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </Button>
      </div>
      <div className={styles.gaming_controller}>
        <ParallaxWrapper parallaxDirection="down" parallaxIntensity="normal">
          <div className="animate-hover transition-fade">
            <Image
              alt="Controller Left"
              className="pixelated"
              width={1920}
              height={1080}
              src="/img/console-game/gaming_controller_left.webp"
              loading="lazy"
              sizes="(max-width: 1920px) 100vw, 1920px"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </ParallaxWrapper>
      </div>
      <div className={styles.gaming_controller}>
        <ParallaxWrapper parallaxDirection="down" parallaxIntensity="normal">
          <div className="animate-hover transition-fade">
            <Image
              alt="Controller Right"
              className="pixelated"
              width={1920}
              height={1080}
              src="/img/console-game/gaming_controller_right.webp"
              loading="lazy"
              sizes="(max-width: 1920px) 100vw, 1920px"
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
