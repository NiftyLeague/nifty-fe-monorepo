import type { ComponentProps, CSSProperties } from 'react'

/**
 * The `<img>` attribute contract shared by every surface that renders an
 * optimised image.
 *
 * Three implementations grew these rules independently: `apps/web` (build-time
 * manifest variants), `apps/smashers` (the Vercel optimiser) and the shared
 * `optimized-image` component the app renders. The optimiser is genuinely
 * per-app; the attribute derivation around it was the same code three times, and
 * this module is that common part:
 *
 *   - source normalisation (string or `{ src, width, height }`) and the
 *     `Image src is required` guard;
 *   - the `decoding` and `loading` defaults, including the eager/lazy rule for
 *     `priority`/`preload`;
 *   - width/height adoption from an object source;
 *   - `fetchPriority` selection (`high` for priority, `low` for lazy);
 *   - `fill` handling (drop the intrinsic size, pin the element to its box);
 *   - dropping `undefined` attributes so React does not emit empty ones.
 *
 * Each caller keeps its own source-url/srcSet production and any extra contract
 * it owns (web's `overrideSrc` escape hatch, its unsafe-scheme rejection, and its
 * `1x` fallback for non-manifest assets).
 */

export type ImageSource = string | { src: string; width?: number; height?: number }

/** Positioning for `fill` images: the element covers its nearest positioned ancestor. */
export const IMAGE_FILL_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
}

export interface ImageAttributeInput extends Omit<ComponentProps<'img'>, 'src'> {
  src: ImageSource
  priority?: boolean
  preload?: boolean
  fill?: boolean
}

/** Resolves the accepted source shapes and refuses an empty one. */
export function imageSource(src: ImageSource): string {
  const source = typeof src === 'string' ? src : src?.src
  if (typeof source !== 'string' || !source) throw new TypeError('Image src is required')
  return source
}

/**
 * Derives the `<img>` attributes every implementation agreed on. The caller
 * replaces `src`/`srcSet` afterwards when it has an optimiser to run.
 */
export function imageAttributes({
  src,
  priority,
  preload,
  fill,
  ...attributes
}: ImageAttributeInput): ComponentProps<'img'> & { src: string } {
  const source = imageSource(src)
  const props: ComponentProps<'img'> & { src: string } = {
    ...attributes,
    src: source,
    decoding: attributes.decoding ?? 'async',
    loading: attributes.loading ?? (priority || preload ? 'eager' : 'lazy'),
  }

  if (!props.width && typeof src === 'object' && src?.width) props.width = src.width
  if (!props.height && typeof src === 'object' && src?.height) props.height = src.height

  if (!props.fetchPriority) {
    props.fetchPriority =
      priority || preload ? 'high' : props.loading === 'lazy' ? 'low' : undefined
  }

  if (fill) {
    delete props.width
    delete props.height
    props.style = { ...IMAGE_FILL_STYLE, ...attributes.style }
  }

  return props
}

/**
 * Drops keys whose value is `undefined`, after the caller has finished assigning
 * `src`/`srcSet`. React would render an explicit `undefined` as no attribute, but
 * the key still travels through the object and shows up in snapshots.
 */
export function stripUndefinedAttributes<T extends object>(attributes: T): T {
  const mutable = attributes as Record<string, unknown>
  for (const key of Object.keys(mutable)) {
    if (mutable[key] === undefined) delete mutable[key]
  }
  return attributes
}
