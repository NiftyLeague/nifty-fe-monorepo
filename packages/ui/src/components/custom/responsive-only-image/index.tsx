import type { JSX } from 'solid-js'

import { getOptimizedImageProps } from '@nl/ui/custom/optimized-image'

const RESPONSIVE_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='

export interface ResponsiveOnlyImageProps {
  alt: string
  class?: string
  className?: string
  height: number
  loading?: 'eager' | 'lazy'
  media: string
  quality?: number
  sizes: string
  src: string
  style?: JSX.CSSProperties | string
  width: number
}

/**
 * Keeps art-directed images out of the non-matching breakpoint's request path.
 * The matching source retains the responsive URL generation and dimensions.
 */
export function ResponsiveOnlyImage(props: ResponsiveOnlyImageProps) {
  const imageProps = getOptimizedImageProps({
    alt: props.alt,
    height: props.height,
    loading: props.loading ?? 'lazy',
    quality: props.quality,
    sizes: props.sizes,
    src: props.src,
    width: props.width,
  })
  const { src: _src, srcSet, sizes: _sizes, ...fallbackProps } = imageProps

  return (
    <picture class="block">
      <source media={props.media} sizes={props.sizes} srcset={srcSet} />
      <img
        {...fallbackProps}
        alt={props.alt}
        class={props.class ?? props.className}
        height={props.height}
        src={RESPONSIVE_PLACEHOLDER}
        style={props.style}
        width={props.width}
      />
    </picture>
  )
}

export function DesktopOnlyImage(props: Omit<ResponsiveOnlyImageProps, 'media'>) {
  return <ResponsiveOnlyImage media="(min-width: 769px)" {...props} />
}

export function MobileOnlyImage(props: Omit<ResponsiveOnlyImageProps, 'media'>) {
  return <ResponsiveOnlyImage media="(max-width: 768px)" {...props} />
}

export default DesktopOnlyImage
