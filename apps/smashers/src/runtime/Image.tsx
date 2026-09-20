import { imageAttributes, stripUndefinedAttributes } from '@nl/ui/lib/image-attributes'

/**
 * The React adapter over the app's image pipeline.
 *
 * astro:assets serves the .astro templates through
 * `runtime/image-service.ts`; React trees cannot call that pipeline
 * (`getImage` is async and the module is absent from client bundles), so this
 * adapter builds the same attributes from the shared policy in
 * `runtime/image-url.ts`. The deploy has no optimizer endpoint, so every
 * source stays on its original URL.
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
 * Smashers' image props: the shared attribute contract. The deploy has no
 * optimizer endpoint, so every source stays on its original URL with no
 * srcset; the width ladder in `runtime/image-url.ts` remains only for
 * consumers that size elements off it.
 */
export function getOptimizedImageProps({
  src: suppliedSource,
  priority,
  preload,
  fill,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  ...attributes
}: OptimizedImageProps): Record<string, unknown> & { src: string } {
  // `sizes` stays in `attributes`: pulling it out here would reorder the emitted
  // attributes, and the rendered output is compared against the previous build.
  const props = imageAttributes({
    ...attributes,
    src: suppliedSource,
    priority,
    preload,
    fill,
  })

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
