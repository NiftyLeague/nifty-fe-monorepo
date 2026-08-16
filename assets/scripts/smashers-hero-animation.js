;(() => {
  const animatedBackground = '/img/games/smashers/background.webp'
  const fallbackBackground = '/img/games/smashers/background.gif'
  const image = document.querySelector('[data-smashers-hero-background]')

  if (!image) return

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const prefersDataSaving = navigator.connection?.saveData === true

  // The poster is already the complete hero surface. Avoid downloading the
  // multi-megabyte animation when the user has explicitly requested less
  // motion or lower data usage.
  if (prefersReducedMotion || prefersDataSaving) return

  const preload = new Image()
  preload.decoding = 'async'
  const useFallback = () => {
    image.removeAttribute('srcset')
    image.src = fallbackBackground
  }
  preload.onload = () => {
    const picture = image.parentElement
    if (!picture) return

    const source = document.createElement('source')
    source.type = 'image/webp'
    source.srcset = animatedBackground
    picture.insertBefore(source, image)
    useFallback()
  }
  preload.onerror = useFallback
  preload.src = animatedBackground
})()
