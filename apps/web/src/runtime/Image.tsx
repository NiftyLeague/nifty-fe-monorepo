import type { JSX } from 'solid-js'
import { imageProps } from './image-props.mjs'

type Source = string | { src: string; width?: number; height?: number }
export interface OptimizedImageProps {
  src: Source
  priority?: boolean
  preload?: boolean
  fill?: boolean
  unoptimized?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  alt?: string
  class?: string
  className?: string
  sizes?: string
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'sync' | 'auto'
  fetchpriority?: 'high' | 'low' | 'auto'
  width?: number | string
  height?: number | string
  style?: JSX.CSSProperties | string
}

export function getOptimizedImageProps(
  props: OptimizedImageProps
): Record<string, unknown> & { src: string } {
  const manifest = typeof WEB_IMAGE_MANIFEST === 'undefined' ? {} : WEB_IMAGE_MANIFEST
  return imageProps(props, manifest) as Record<string, unknown> & { src: string }
}

/**
 * High-priority artwork is preloaded through a `<link rel="preload">` injected
 * on mount. The React version used `react-dom/preload`, which emitted the link
 * during SSR; Astro's Solid islands render statically, so the hint is attached
 * as soon as the island hydrates instead.
 */
export default function OptimizedImage(props: OptimizedImageProps) {
  const result = getOptimizedImageProps(props)

  if ((props.priority || props.preload) && typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.setAttribute('fetchpriority', 'high')
    if (result.srcSet) link.setAttribute('imagesrcset', String(result.srcSet))
    if (result.sizes) link.setAttribute('imagesizes', String(result.sizes))
    link.href = result.src
    document.head.append(link)
  }

  return <img {...result} />
}
export { OptimizedImage }
