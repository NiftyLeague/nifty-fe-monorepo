import { splitProps, type ComponentProps, type JSX } from 'solid-js'

type AnimatedImageProps = Omit<ComponentProps<'img'>, 'src' | 'loading'> & {
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
export function AnimatedImage(props: AnimatedImageProps) {
  const [local, imageProps] = splitProps(props, [
    'animatedMedia',
    'animatedSrc',
    'animatedType',
    'fallbackAnimatedSrc',
    'fallbackAnimatedType',
    'decoding',
    'fetchpriority',
    'fill',
    'loading',
    'priority',
    'sizes',
    'style',
    'unoptimized',
  ])
  const resolvedLoading = () => (local.priority ? 'eager' : (local.loading ?? 'lazy'))
  const pictureStyle = (): JSX.CSSProperties | undefined =>
    local.fill ? { position: 'absolute', inset: '0', display: 'block' } : undefined
  const imageStyle = (): JSX.CSSProperties | string | undefined =>
    local.fill
      ? {
          position: 'absolute',
          inset: '0',
          width: '100%',
          height: '100%',
          ...(typeof local.style === 'object' ? local.style : {}),
        }
      : local.style

  return (
    <picture style={pictureStyle()}>
      {local.animatedSrc ? (
        <source type={local.animatedType} media={local.animatedMedia} srcset={local.animatedSrc} />
      ) : null}
      {local.fallbackAnimatedSrc ? (
        <source type={local.fallbackAnimatedType} srcset={local.fallbackAnimatedSrc} />
      ) : null}
      <img
        {...imageProps}
        decoding={local.decoding ?? 'async'}
        fetchpriority={local.fetchpriority ?? (resolvedLoading() === 'lazy' ? 'low' : undefined)}
        loading={resolvedLoading()}
        sizes={local.sizes}
        style={imageStyle()}
      />
    </picture>
  )
}

export default AnimatedImage
