import { preload as preloadImage } from 'react-dom'
import type { ComponentProps } from 'react'
import { imageProps } from './image-props.mjs'

type Source = string | { src: string; width?: number; height?: number }
export interface OptimizedImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  src: Source
  priority?: boolean
  preload?: boolean
  fill?: boolean
  unoptimized?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function getOptimizedImageProps(
  props: OptimizedImageProps
): ComponentProps<'img'> & { src: string } {
  const manifest = typeof __WEB_IMAGE_MANIFEST__ === 'undefined' ? {} : __WEB_IMAGE_MANIFEST__
  return imageProps(props, manifest) as ComponentProps<'img'> & { src: string }
}

export default function OptimizedImage(props: OptimizedImageProps) {
  const result = getOptimizedImageProps(props)
  if (props.priority || props.preload) {
    preloadImage(result.src, {
      as: 'image',
      fetchPriority: 'high',
      imageSrcSet: result.srcSet,
      imageSizes: result.sizes,
    })
  }
  return <img {...result} />
}
export { OptimizedImage }
