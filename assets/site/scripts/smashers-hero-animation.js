;(() => {
  const heroVideo = 'https://cdn.niftyleague.com/media/video/smashers-hero.mp4'
  const image = document.querySelector('[data-smashers-hero-background]')

  if (!image) return

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const prefersDataSaving = navigator.connection?.saveData === true
  const effectiveType = navigator.connection?.effectiveType
  const slowConnection = effectiveType === 'slow-2g' || effectiveType === '2g'

  if (prefersReducedMotion || prefersDataSaving || slowConnection) return

  const probe = document.createElement('video')
  if (!probe.canPlayType('video/mp4')) return

  probe.muted = true
  probe.loop = true
  probe.playsInline = true
  probe.preload = 'auto'
  probe.setAttribute('aria-hidden', 'true')
  probe.className = image.className
  probe.dataset.smashersHeroVideo = ''
  probe.poster = image.currentSrc || image.src
  probe.src = heroVideo

  const reveal = () => {
    const picture = image.parentElement
    if (!picture || !picture.parentElement) return
    if (document.querySelector('[data-smashers-hero-video]')) return

    // The video mounts underneath the picture (same stacking level, earlier
    // in DOM order), which makes the swap seamless: before it plays it is
    // transparent or painting its poster — the same asset the picture shows —
    // so the picture is the visible layer either way. Once real frames play,
    // the picture must be retired or it stays painted over the animation
    // forever; a video that never plays simply leaves the hero intact.
    picture.parentElement.insertBefore(probe, picture)
    probe.addEventListener('playing', () => (picture.style.visibility = 'hidden'), { once: true })
  }

  // Muted autoplay can be refused while the tab is hidden or unfocused — the
  // rejection must not stall the video before its first frame: retry when the
  // tab becomes visible again or on the visitor's next interaction.
  const attemptPlayback = () => {
    const play = probe.play?.()
    if (play && typeof play.catch === 'function') {
      play.catch(() => {
        if (document.visibilityState !== 'visible') {
          document.addEventListener(
            'visibilitychange',
            () => {
              if (document.visibilityState === 'visible') attemptPlayback()
            },
            { once: true }
          )
        }
        window.addEventListener('pointerdown', attemptPlayback, { once: true, passive: true })
        window.addEventListener('keydown', attemptPlayback, { once: true, passive: true })
      })
    }
  }

  probe.addEventListener(
    'loadeddata',
    () => {
      reveal()
      attemptPlayback()
    },
    { once: true }
  )
  probe.addEventListener('error', () => probe.remove(), { once: true })
})()
