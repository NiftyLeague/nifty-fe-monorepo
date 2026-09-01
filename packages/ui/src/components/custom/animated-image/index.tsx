import type { CSSProperties } from 'react'

type AnimatedImageProps = Omit<React.ComponentProps<'img'>, 'src' | 'loading'> & {
  /** Source for an alternate image format or deferred animation. */
  animatedSrc?: string
  /** MIME type for animatedSrc. Omit when the browser can infer it. */
  animatedType?: string
  /** Optional media query for animatedSrc. */
  animatedMedia?: string
  /** Compatibility source rendered after animatedSrc in the picture source order. */
  fallbackAnimatedSrc?: string
  /** MIME type for fallbackAnimatedSrc. */
  fallbackAnimatedType?: string
  decoding?: 'async' | 'auto' | 'sync'
  fill?: boolean
  loading?: 'eager' | 'lazy'
  priority?: boolean
  sizes?: string
  src: string
  unoptimized?: boolean
}

/**
 * Serves an animated WebP when supported and keeps the original animated image
 * as a compatibility fallback. Native markup keeps this shared component safe
 * in both server and client bundles, including API-provided image URLs.
 */
export function AnimatedImage({
  animatedMedia,
  animatedSrc,
  animatedType,
  fallbackAnimatedSrc,
  fallbackAnimatedType,
  ...props
}: AnimatedImageProps) {
  const {
    decoding,
    fetchPriority,
    fill,
    loading,
    priority,
    sizes,
    style,
    unoptimized: _unoptimized,
    ...imageProps
  } = props
  const resolvedLoading = priority ? 'eager' : (loading ?? 'lazy')
  const source = animatedSrc
  const sourceMedia = animatedMedia
  const sourceType = animatedType
  const pictureStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, display: 'block' }
    : undefined
  const imageStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }
    : style

  return (
    <picture style={pictureStyle}>
      {source ? <source type={sourceType} media={sourceMedia} srcSet={source} /> : null}
      {fallbackAnimatedSrc ? (
        <source type={fallbackAnimatedType} srcSet={fallbackAnimatedSrc} />
      ) : null}
      <img
        {...imageProps}
        decoding={decoding ?? 'async'}
        fetchPriority={fetchPriority ?? (resolvedLoading === 'lazy' ? 'low' : undefined)}
        loading={resolvedLoading}
        sizes={sizes}
        style={imageStyle}
      />
    </picture>
  )
}

export default AnimatedImage
