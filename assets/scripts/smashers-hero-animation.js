;(() => {
  const heroVideo = '/video/smashers-hero.mp4'
  const image = document.querySelector('[data-smashers-hero-background]')

  if (!image) return

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const prefersDataSaving = navigator.connection?.saveData === true
  // 464 KB is the whole animation. On a connection slower than ~2 Mbit/s that is
  // seconds of bandwidth spent on a decorative backdrop, so the poster stays
  // instead. `downlink` is Chromium-only; elsewhere the gate simply does not apply.
  const downlink = navigator.connection?.downlink
  const slowConnection = typeof downlink === 'number' && downlink > 0 && downlink < 2

  // The poster is already the complete hero surface. Skip the animation when the
  // user asked for less motion or lower data usage, on a slow connection, or when
  // the browser cannot play the video at all.
  if (prefersReducedMotion || prefersDataSaving || slowConnection) return

  const probe = document.createElement('video')
  if (!probe.canPlayType('video/mp4')) return

  // The animation ships as a muted H.264 loop rather than an animated WebP: the
  // WebP was 3.4 MB and the same 150 frames are 464 KB as video, with hardware
  // decode instead of per-frame image decoding. The script only swaps it in once
  // the first frame is decodable, so the poster never flickers.
  probe.muted = true
  probe.loop = true
  probe.playsInline = true
  probe.preload = 'auto'
  probe.setAttribute('aria-hidden', 'true')
  probe.className = image.className
  probe.dataset.smashersHeroVideo = ''
  // The poster is the hero's LCP image and is already decoded by the time this
  // runs, so painting it as the video's first frame keeps LCP where it was. A
  // video without a poster paints its first decoded frame instead, which pushed
  // the measured LCP from 5.6 s to 8.9 s on the throttled mobile profile.
  probe.poster = image.currentSrc || image.src
  probe.src = heroVideo

  const reveal = () => {
    const picture = image.parentElement
    if (!picture || !picture.parentElement) return
    if (document.querySelector('[data-smashers-hero-video]')) return

    // `<picture>` only accepts `source` and `img`, so the video is a sibling that
    // inherits the poster's positioning class and paints over it. The poster stays
    // in the document as the fallback if playback never starts.
    picture.parentElement.insertBefore(probe, picture)
    probe.style.opacity = '0'
    probe.style.transition = 'opacity 400ms ease-out'
    const play = probe.play?.()
    if (play && typeof play.catch === 'function') play.catch(() => {})
    else requestAnimationFrame(() => (probe.style.opacity = '1'))
    probe.addEventListener('playing', () => (probe.style.opacity = '1'), { once: true })
  }

  probe.addEventListener('loadeddata', reveal, { once: true })
  probe.addEventListener('error', () => probe.remove(), { once: true })
})()
