/**
 * Sätteri hast plugin: adds `loading="lazy"` and `decoding="async"` to images.
 *
 * The previous site lazy-loaded every content image below the fold, which matters
 * here: the Comics gallery renders six ~1 MB page scans, and loading them eagerly
 * made one of them the LCP at tens of seconds. Images that already declare
 * `loading` or `fetchpriority` opt out, so pages that intentionally prioritise a
 * hero (the roadmap poster, the About banner) keep eager loading.
 *
 * Sätteri plugins are named visitor objects: `filter` (an array, even for one
 * tag) selects nodes on the Rust side and `visit` must return the node — a new
 * object when changing properties, since mutating in place is not observed.
 */
export const rehypeLazyImages = {
  name: 'nl-lazy-images',
  element: {
    filter: ['img'],
    visit(node) {
      const properties = node.properties ?? {}
      if (properties.loading !== undefined || properties.fetchPriority !== undefined) return
      return {
        ...node,
        properties: { ...properties, loading: 'lazy', decoding: properties.decoding ?? 'async' },
      }
    },
  },
}

export default rehypeLazyImages
