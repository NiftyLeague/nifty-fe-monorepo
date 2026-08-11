import Image, { type ImageProps } from 'next/image'

type AnimatedImageProps = ImageProps & { webpSrc?: string }

/**
 * Serves an animated WebP when supported and keeps the original animated image
 * as a compatibility fallback. The fallback still uses Next Image's normal
 * sizing and loading behavior.
 */
export function AnimatedImage({ webpSrc, ...props }: AnimatedImageProps) {
  return (
    <picture>
      {webpSrc ? <source type="image/webp" srcSet={webpSrc} /> : null}
      <Image {...props} />
    </picture>
  )
}

export default AnimatedImage
