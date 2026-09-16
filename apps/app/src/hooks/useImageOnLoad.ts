import { createSignal } from 'solid-js'

interface ImageClasses {
  thumbnail: string
  fullSize: string
}

interface ImageOnLoadType {
  handleImageOnLoad: () => void
  classes: ImageClasses
}

function useImageOnLoad(): ImageOnLoadType {
  const [isLoaded, setIsLoaded] = createSignal<boolean>(false)

  // Triggered when full image will be loaded.
  const handleImageOnLoad = () => {
    setIsLoaded(true)
  }

  const classes: ImageClasses = {
    // Thumbnail: blurred until the full image has loaded, then hidden after a
    // 500ms delay (transition: visibility 0ms ease-out 500ms).
    get thumbnail(): string {
      return `blur-sm transition-(--img-trans-visibility) duration-0 ease-out delay-500 ${
        isLoaded() ? 'invisible' : 'visible'
      }`
    },
    // Full image: fades in over 500ms (transition: opacity 500ms ease-in 0ms).
    get fullSize(): string {
      return `transition-(--img-trans-opacity) duration-500 ease-in ${
        isLoaded() ? 'opacity-100' : 'opacity-0'
      }`
    },
  }

  return { handleImageOnLoad, classes }
}

export default useImageOnLoad
