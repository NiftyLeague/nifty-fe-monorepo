import { preload as preloadImage } from 'react-dom'
import type { ComponentProps, CSSProperties } from 'react'

type ImageSource = string | { src: string; width?: number; height?: number }

/**
 * App-local replacement for the shared `@nl/ui/custom/optimized-image`
 * component, which depends on a framework image pipeline (its loader, config,
 * pipeline that this app no longer runs.
 *
 * The replacement keeps the same props contract and renders a native `<img>` at
 * the original source. The artwork this app optimizes is already committed as
 * sized `.webp` files, and the loader hints below (eager/high for
 * above-the-fold images, lazy/low for the rest) are preserved exactly. The one
 * capability that goes away is server-side resizing into additional width
 * buckets.
 */
export interface OptimizedImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  src: ImageSource
  priority?: boolean
  preload?: boolean
  fill?: boolean
  unoptimized?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

const FILL_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
}

export function getOptimizedImageProps(props: OptimizedImageProps): ComponentProps<'img'> {
  const {
    src: suppliedSource,
    priority,
    preload,
    quality: _quality,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    fill,
    unoptimized: _unoptimized,
    ...attributes
  } = props

  const source = typeof suppliedSource === 'string' ? suppliedSource : suppliedSource?.src
  if (typeof source !== 'string' || !source) throw new TypeError('Image src is required')

  const imageProps: ComponentProps<'img'> = {
    ...attributes,
    src: source,
    decoding: attributes.decoding ?? 'async',
    loading: attributes.loading ?? (priority || preload ? 'eager' : 'lazy'),
  }

  if (imageProps.width === undefined && typeof suppliedSource !== 'string') {
    imageProps.width = suppliedSource?.width
  }
  if (imageProps.height === undefined && typeof suppliedSource !== 'string') {
    imageProps.height = suppliedSource?.height
  }

  if (imageProps.fetchPriority === undefined) {
    if (priority || preload) imageProps.fetchPriority = 'high'
    else if (imageProps.loading === 'lazy') imageProps.fetchPriority = 'low'
  }

  if (fill) {
    delete imageProps.width
    delete imageProps.height
    imageProps.style = { ...FILL_STYLE, ...attributes.style }
  }

  for (const key of Object.keys(imageProps)) {
    if (imageProps[key as keyof ComponentProps<'img'>] === undefined) {
      delete imageProps[key as keyof ComponentProps<'img'>]
    }
  }

  return imageProps
}

export function OptimizedImage(props: OptimizedImageProps) {
  const imageProps = getOptimizedImageProps(props)

  // Carry the explicit priority signal through as a matching resource hint.
  if ((props.priority || props.preload) && typeof imageProps.src === 'string') {
    preloadImage(imageProps.src, {
      as: 'image',
      fetchPriority: 'high',
      ...(imageProps.srcSet
        ? { imageSrcSet: imageProps.srcSet, imageSizes: imageProps.sizes }
        : {}),
    })
  }

  return <img {...imageProps} />
}

export default OptimizedImage
