import { imageProps } from './image-props.mjs'

declare const APP_IMAGE_MANIFEST: Record<string, { hash: string; width: number; height: number }>

interface ImagePreloadLink {
  rel: 'preload'
  as: 'image'
  href: string
  fetchpriority: 'high' | 'low' | 'auto'
  imagesrcset?: string
  imagesizes?: string
}

interface ImagePreloadOptions {
  /** Rendered width of the image in px; drives the manifest variant choice. */
  width?: number
  sizes?: string
  quality?: number
}

/**
 * Build a document-head preload link for an image, resolving the same
 * build-time manifest variant that `OptimizedImage` renders. The browser can
 * then start the LCP fetch before the component tree evaluates — the
 * client-side preload injection in `OptimizedImage` cannot do this, because
 * it only runs after hydration. Route `head()` functions should use this for
 * known above-the-fold art.
 */
export function buildImagePreloadLink(
  src: string,
  options: ImagePreloadOptions = {}
): ImagePreloadLink {
  // The manifest is injected by the Vite `define` of the prepared build; in
  // unwired contexts (unit tests, unbundled SSR) it falls back to originals.
  const manifest = typeof APP_IMAGE_MANIFEST === 'undefined' ? {} : APP_IMAGE_MANIFEST
  const resolved = imageProps({ src, ...options }, manifest)
  const href = String(resolved.src)
  const srcSet = resolved.srcSet ? String(resolved.srcSet) : undefined
  const sizes = resolved.sizes ? String(resolved.sizes) : undefined

  return {
    rel: 'preload',
    as: 'image',
    href,
    fetchpriority: 'high' as const,
    ...(srcSet ? { imagesrcset: srcSet } : {}),
    ...(sizes ? { imagesizes: sizes } : {}),
  }
}
