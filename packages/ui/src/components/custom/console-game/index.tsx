import { createEffect, createSignal, type JSX } from 'solid-js'
import { Button } from '@nl/ui/base/button'
import { cx } from '@nl/ui/class-names'
import NativeImage from '@nl/ui/custom/native-image'
import { ParallaxWrapper } from '@nl/ui/custom/parallax-wrapper'

import { CONSOLE_ARTWORK_DIMENSIONS } from './backdrop'
import styles from './index.module.css'

export interface ConsoleGameProps {
  children?: JSX.Element
  isNearViewport?: boolean
  renderGradientOverlay?: boolean
  src: string
}

export function ConsoleGame(props: ConsoleGameProps) {
  let videoEl: HTMLVideoElement | undefined
  const [isPlaying, setIsPlaying] = createSignal(false)

  const togglePlay = () => {
    if (!videoEl) return

    if (videoEl.paused) {
      videoEl.play().catch((error) => {
        console.error('Play failed:', error)
      })
    } else {
      videoEl.pause()
    }
  }

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)

  const nearViewport = () => props.isNearViewport ?? true

  createEffect(() => {
    const video = videoEl
    if (!video) return

    if (nearViewport()) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  })

  return (
    <div class="relative overflow-hidden h-full">
      <div
        style={{ position: 'relative', display: 'flex', 'flex-grow': '1' }}
        class="md:animation-hidden h-full"
      >
        {props.children}
        <video
          ref={(el) => (videoEl = el)}
          id="console-video"
          width="100%"
          height="100%"
          muted
          autoplay={nearViewport()}
          loop
          playsinline
          preload={nearViewport() ? 'metadata' : 'none'}
          class={styles.game_video}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handlePause}
        >
          {nearViewport() ? <source src={props.src} type="video/mp4" /> : null}
        </video>
        <Button
          type="button"
          onClick={togglePlay}
          variant="ghost"
          size="icon"
          aria-label={isPlaying() ? 'Pause video' : 'Play video'}
          class={cx(styles.bonk_note, 'h-auto w-auto rounded-none p-0 hover:bg-transparent')}
        >
          {/*
            Decorative: the wrapping Button already carries the accessible name
            (`Play video` / `Pause video`). A descriptive alt here is redundant
            AND visible, because a browser paints alt text at the top-left of an
            unloaded image — and this wrapper is full-bleed, so it showed up as
            placeholder text across the console before the art loaded.
          */}
          <NativeImage
            alt=""
            class="pixelated"
            width={CONSOLE_ARTWORK_DIMENSIONS.width}
            height={CONSOLE_ARTWORK_DIMENSIONS.height}
            src="/img/console-game/bonk.webp"
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: 'auto', 'object-fit': 'contain' }}
          />
        </Button>
      </div>
      <div class={styles.gaming_controller}>
        <ParallaxWrapper parallaxDirection="down" parallaxIntensity="normal">
          <div class="animate-hover transition-fade">
            <NativeImage
              alt=""
              class="pixelated"
              width={CONSOLE_ARTWORK_DIMENSIONS.width}
              height={CONSOLE_ARTWORK_DIMENSIONS.height}
              src="/img/console-game/gaming_controller_left.webp"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', 'object-fit': 'contain' }}
            />
          </div>
        </ParallaxWrapper>
      </div>
      <div class={styles.gaming_controller}>
        <ParallaxWrapper parallaxDirection="down" parallaxIntensity="normal">
          <div class="animate-hover transition-fade">
            <NativeImage
              alt=""
              class="pixelated"
              width={CONSOLE_ARTWORK_DIMENSIONS.width}
              height={CONSOLE_ARTWORK_DIMENSIONS.height}
              src="/img/console-game/gaming_controller_right.webp"
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', 'object-fit': 'contain' }}
            />
          </div>
        </ParallaxWrapper>
      </div>
      {(props.renderGradientOverlay ?? true) ? <div class="dark-gradient-overlay" /> : null}
    </div>
  )
}

export default ConsoleGame
