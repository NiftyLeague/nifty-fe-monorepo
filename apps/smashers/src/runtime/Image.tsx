import { preload as preloadImage } from 'react-dom'
import type { ComponentProps } from 'react'
import { imageAttributes, imageSource, stripUndefinedAttributes } from '@nl/ui/lib/image-attributes'
import { canOptimize, isOptimizableSource, optimizedUrl, selectWidths } from './image-url'

/**
 * The React adapter over the app's image optimizer.
 *
 * astro:assets serves the .astro templates through
 * `runtime/vercel-image-service.ts`; React trees cannot call that pipeline
 * (`getImage` is async and the module is absent from client bundles), so this
 * adapter builds the same URLs from the shared policy in `runtime/image-url.ts`.
 * The shared props contract is preserved, including the optimisation the Next
 * build performed: `/_next/image?url=...&w=...` became Vercel's own optimiser,
 * `/_vercel/image?url=...&w=...`, with the same responsive `srcSet` ladder.
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

/**
 * Smashers' image props: the shared attribute contract plus this app's optimiser.
 *
 * The optimiser is Vercel's image service, which only exists on Vercel, so the
 * URL is gated on `import.meta.env.VERCEL` and every other environment (dev,
 * local builds, tests) gets the plain asset path. Only local artwork under
 * `/img/` is optimised; remote URLs and SVGs pass through untouched.
 */
export function getOptimizedImageProps({
  src: suppliedSource,
  priority,
  preload,
  fill,
  unoptimized,
  quality = 75,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  ...attributes
}: OptimizedImageProps): ComponentProps<'img'> & { src: string } {
  const source = imageSource(suppliedSource)

  // `sizes` stays in `attributes`: pulling it out here would reorder the emitted
  // attributes, and the rendered output is compared against the previous build.
  const props = imageAttributes({
    ...attributes,
    src: suppliedSource,
    priority,
    preload,
    fill,
  })

  const optimizable = canOptimize() && !unoptimized && isOptimizableSource(source)
  if (optimizable) {
    const nativeWidth =
      typeof suppliedSource === 'object' ? suppliedSource?.width : Number(props.width) || undefined
    const widths = selectWidths(nativeWidth, attributes.sizes)
    props.src = optimizedUrl(source, widths.at(-1) as number, quality)
    props.srcSet = widths
      .map((width) => `${optimizedUrl(source, width, quality)} ${width}w`)
      .join(', ')
  }

  return stripUndefinedAttributes(props)
}

export default function OptimizedImage(props: OptimizedImageProps) {
  const result = getOptimizedImageProps(props)
  if (props.priority || props.preload) {
    preloadImage(result.src, {
      as: 'image',
      fetchPriority: 'high',
      imageSrcSet: result.srcSet,
      imageSizes: props.sizes,
    })
  }
  return <img {...result} />
}
export { OptimizedImage }
