'use client'

import { createSignal, type JSX } from 'solid-js'

interface ImageStyle {
  thumbnail: JSX.CSSProperties
  fullSize: JSX.CSSProperties
}

interface ImageOnLoadType {
  handleImageOnLoad: () => void
  css: ImageStyle
}

function useImageOnLoad(): ImageOnLoadType {
  const [isLoaded, setIsLoaded] = createSignal<boolean>(false)

  // Triggered when full image will be loaded.
  const handleImageOnLoad = () => {
    setIsLoaded(true)
  }

  const css: ImageStyle = {
    // Thumbnail style.
    get thumbnail(): JSX.CSSProperties {
      return {
        visibility: isLoaded() ? 'hidden' : 'visible',
        filter: 'blur(8px)',
        transition: 'visibility 0ms ease-out 500ms',
      }
    },
    // Full image style.
    get fullSize(): JSX.CSSProperties {
      return { opacity: isLoaded() ? 1 : 0, transition: 'opacity 500ms ease-in 0ms' }
    },
  }

  return { handleImageOnLoad, css }
}

export default useImageOnLoad
