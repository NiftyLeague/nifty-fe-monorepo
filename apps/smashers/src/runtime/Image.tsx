import type { ComponentProps } from 'react'

/**
 * App-local replacement for `@nl/ui/custom/optimized-image`, which is built on
 * next/image internals. Smashers serves its artwork from the shared asset
 * library with a fixed-quality pipeline, so the shared props contract is kept
 * and mapped onto a plain <img>.
 *
 * The Vite alias in astro.config.mjs redirects the shared specifier here; the
 * consuming components keep importing `@nl/ui/custom/optimized-image`.
 */
export interface OptimizedImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  src: string | { src: string; width?: number; height?: number }
  priority?: boolean
  preload?: boolean
  fill?: boolean
  unoptimized?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function getOptimizedImageProps({
  src: suppliedSource,
  priority,
  preload,
  fill,
  unoptimized: _unoptimized,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  ...attributes
}: OptimizedImageProps): ComponentProps<'img'> & { src: string } {
  const source = typeof suppliedSource === 'string' ? suppliedSource : suppliedSource?.src
  if (typeof source !== 'string' || !source) throw new TypeError('Image src is required')

  const props: ComponentProps<'img'> & { src: string } = {
    ...attributes,
    src: source,
    decoding: attributes.decoding ?? 'async',
    loading: attributes.loading ?? (priority || preload ? 'eager' : 'lazy'),
  }
  if (!props.width && typeof suppliedSource === 'object' && suppliedSource?.width)
    props.width = suppliedSource.width
  if (!props.height && typeof suppliedSource === 'object' && suppliedSource?.height)
    props.height = suppliedSource.height
  if (!props.fetchPriority)
    props.fetchPriority =
      priority || preload ? 'high' : props.loading === 'lazy' ? 'low' : undefined
  if (fill) {
    delete props.width
    delete props.height
    props.style = {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      ...attributes.style,
    }
  }
  return props
}

export default function OptimizedImage(props: OptimizedImageProps) {
  return <img {...getOptimizedImageProps(props)} />
}
export { OptimizedImage }
