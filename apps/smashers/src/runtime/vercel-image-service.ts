import buildService from '@astrojs/vercel/build-image-service'
import type { ExternalImageService, ImageTransform } from 'astro'
import { canOptimize, isOptimizableSource, optimizedUrl } from './image-url'

/**
 * The app-wide astro:assets image service.
 *
 * The Vercel adapter's own build service emits `/_vercel/image` URLs for every
 * image unconditionally, while this deployment renders plain asset paths
 * wherever Vercel's optimizer does not exist (local builds, tests, dev). The
 * override keeps the adapter's URL construction, width validation, and
 * attribute derivation, and adds exactly one gate: only local artwork under
 * `/img/` on a Vercel build is optimized — the same rule the React adapter in
 * `runtime/Image.tsx` applies, so both surfaces and the preload hints they
 * share resolve to identical candidates.
 */

const sourceOf = (src: ImageTransform['src']): string =>
  typeof src === 'string' ? src : (src?.src ?? '')

const optimizable = (options: ImageTransform): boolean =>
  canOptimize() && isOptimizableSource(sourceOf(options.src))

const service: ExternalImageService = {
  ...buildService,
  // The adapter defaults unspecified quality to 100; the app's optimizer
  // ladder has always rendered at 75.
  validateOptions(options, serviceOptions, logger) {
    return buildService.validateOptions!(
      { ...options, quality: options.quality ?? 75 },
      serviceOptions,
      logger
    )
  },
  getURL(options) {
    const source = sourceOf(options.src)
    if (canOptimize() && isOptimizableSource(source)) {
      return optimizedUrl(source, options.width as number, options.quality as number)
    }
    // Everything else — remote URLs, SVGs, bundled assets — is already its own
    // served URL.
    return source
  },
  getSrcSet(options, imageConfig, logger) {
    if (!optimizable(options)) return []
    return buildService.getSrcSet!(options, imageConfig, logger)
  },
}

export default service
