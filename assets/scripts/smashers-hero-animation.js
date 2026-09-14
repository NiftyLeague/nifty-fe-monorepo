;(() => {
  const heroVideo = '/video/smashers-hero.mp4'
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
