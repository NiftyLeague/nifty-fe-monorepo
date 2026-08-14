import Image, { type ImageProps } from 'next/image'
import type { CSSProperties } from 'react'

type AnimatedImageProps = ImageProps & { webpSrc?: string }

/**
 * Serves an animated WebP when supported and keeps the original animated image
 * as a compatibility fallback. The fallback still uses Next Image's normal
 * sizing and loading behavior.
 */
export function AnimatedImage({ webpSrc, ...props }: AnimatedImageProps) {
  const pictureStyle: CSSProperties | undefined = props.fill
    ? { position: 'absolute', inset: 0, display: 'block' }
    : undefined

  return (
    <picture style={pictureStyle}>
      {webpSrc ? <source type="image/webp" srcSet={webpSrc} /> : null}
      <Image {...props} />
    </picture>
  )
}

export default AnimatedImage
