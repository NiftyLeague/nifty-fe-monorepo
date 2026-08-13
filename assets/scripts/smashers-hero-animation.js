;(() => {
  const animatedBackground = '/img/games/smashers/background.webp'
  const fallbackBackground = '/img/games/smashers/background.gif'
  const image = document.querySelector('[data-smashers-hero-background]')

  if (!image) return

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
