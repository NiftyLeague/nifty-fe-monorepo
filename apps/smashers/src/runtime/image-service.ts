import type { ExternalImageService, ImageTransform } from 'astro'

/**
 * The app-wide astro:assets image service for the Cloudflare deploy.
 *
 * Derives every URL itself and emits plain asset paths — no optimizer
 * endpoint. The adapter's own passthrough service rejects string sources that
 * omit an explicit height, but this app's pages pass only the dimensions the
 * previous sharp-backed pipeline measured, so the service intentionally
 * inherits no validation: validateOptions just fills the quality the render
 * ladder always assumed (75, versus the generic default of 100).
 *
 * Deliberately imports nothing from `astro/assets`: the service module is
 * bundled into the Worker, and that barrel pulls in sharp, which cannot load
 * under workerd. getHTMLAttributes mirrors the base service's attribute
 * derivation (reserved keys stripped, lazy/async defaults) for both string
 * and ESM-imported sources; getSrcSet stays an empty array because srcset
 * rungs would all point at the same file.
 */

const sourceOf = (src: ImageTransform['src']): string =>
  typeof src === 'string' ? src : (src?.src ?? '')

const service: ExternalImageService = {
  validateOptions(options) {
    return { ...options, quality: options.quality ?? 75 }
  },
  getURL(options) {
    return sourceOf(options.src)
  },
  getSrcSet() {
    return []
  },
  getHTMLAttributes(options) {
    const {
      src,
      width,
      height,
      format: _format,
      quality: _quality,
      densities: _densities,
      widths: _widths,
      formats: _formats,
      layout: _layout,
      priority: _priority,
      fit: _fit,
      position: _position,
      background: _background,
      ...attributes
    } = options
    const measured = typeof src === 'string' ? {} : { width: src.width, height: src.height }
    return {
      ...attributes,
      width: width ?? measured.width,
      height: height ?? measured.height,
      loading: attributes.loading ?? 'lazy',
      decoding: attributes.decoding ?? 'async',
    }
  },
}

export default service
