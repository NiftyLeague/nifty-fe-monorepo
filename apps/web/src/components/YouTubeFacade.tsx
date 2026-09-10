'use client'

import { useState, type ComponentPropsWithoutRef } from 'react'
import { LazyYouTubeEmbed } from '@nl/ui/custom/lazy-youtube-embed'
import styles from '@/app/(main)/games/index.module.css'

type EmbedProps = ComponentPropsWithoutRef<typeof LazyYouTubeEmbed>

/**
 * Click-to-play facade for below-the-fold YouTube trailers. The local poster
 * renders in place of the player, so no third-party bytes (player scripts,
 * video segments, cookies) are requested until the visitor asks for the
 * trailer. Clicking swaps in the real iframe with autoplay enabled.
 */
export default function YouTubeFacade({ src, title, poster }: EmbedProps & { poster?: string }) {
  const [playing, setPlaying] = useState(false)

  const autoplaySrc = src.includes('autoplay') ? src : `${src}${src.includes('?') ? '&' : '?'}autoplay=1`

  if (playing) return <LazyYouTubeEmbed src={autoplaySrc} title={title} className={styles.video} />

  return (
    <button
      type="button"
      className={`group relative block w-full cursor-pointer border-0 bg-transparent p-0 ${styles.video}`}
      onClick={() => setPlaying(true)}
      aria-label={`Play the ${title} trailer`}
    >
      {poster ? (
        <img
          src={poster}
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-cover"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/85 text-background transition-transform group-hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5 fill-current">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  )
}
