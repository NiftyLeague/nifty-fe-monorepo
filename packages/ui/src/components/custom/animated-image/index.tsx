import type { CSSProperties } from 'react'

type AnimatedImageProps = Omit<React.ComponentProps<'img'>, 'src' | 'loading'> & {
  decoding?: 'async' | 'auto' | 'sync'
  fill?: boolean
  loading?: 'eager' | 'lazy'
  priority?: boolean
  sizes?: string
  src: string
  unoptimized?: boolean
  webpSrc?: string
}

/**
 * Serves an animated WebP when supported and keeps the original animated image
 * as a compatibility fallback. Native markup keeps this shared component safe
 * in both server and client bundles, including API-provided image URLs.
 */
export function AnimatedImage({ webpSrc, ...props }: AnimatedImageProps) {
  const {
    decoding,
    fill,
    loading,
    priority,
    sizes,
    style,
    unoptimized: _unoptimized,
    ...imageProps
  } = props
  const pictureStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, display: 'block' }
    : undefined
  const imageStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }
    : style

  return (
    <picture style={pictureStyle}>
      {webpSrc ? <source type="image/webp" srcSet={webpSrc} /> : null}
      <img
        {...imageProps}
        decoding={decoding ?? 'async'}
        loading={priority ? 'eager' : (loading ?? 'lazy')}
        sizes={sizes}
        style={imageStyle}
      />
    </picture>
  )
}

export default AnimatedImage
