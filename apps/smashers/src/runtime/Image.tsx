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
export interface OptimizedImageProps extends Omit<Record<string, unknown>, 'src'> {
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
}: OptimizedImageProps): Record<string, unknown> & { src: string } {
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
      typeof suppliedSource === 'object'
        ? suppliedSource?.width
        : Number(props.width as string | undefined) || undefined
    const widths = selectWidths(nativeWidth, attributes.sizes as string | undefined)
    props.src = optimizedUrl(source, widths.at(-1) as number, quality)
    props.srcset = widths
      .map((width) => `${optimizedUrl(source, width, quality)} ${width}w`)
      .join(', ')
  }

  return stripUndefinedAttributes(props as unknown as Record<string, unknown>) as Record<
    string,
    unknown
  > & { src: string }
}

export default function OptimizedImage(props: OptimizedImageProps) {
  const result = getOptimizedImageProps(props)

  // High-priority artwork gets a preload hint once the island hydrates; the
  // React version used `react-dom/preload`, which emitted the link during SSR.
  if ((props.priority || props.preload) && typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.setAttribute('fetchpriority', 'high')
    if (result.srcset) link.setAttribute('imagesrcset', String(result.srcset))
    if (props.sizes) link.setAttribute('imagesizes', String(props.sizes))
    link.href = String(result.src)
    document.head.append(link)
  }

  return <img {...result} />
}
export { OptimizedImage }
