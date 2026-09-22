import { describe, expect, it } from 'bun:test'

import { buildImagePreloadLink } from './image-preloads'

describe('buildImagePreloadLink', () => {
  it('emits a high-priority image preload for the original source', () => {
    const link = buildImagePreloadLink(
      'https://cdn.niftyleague.com/media/img/games/smashers/smashers-poster.jpg'
    )

    expect(link).toEqual({
      rel: 'preload',
      as: 'image',
      href: 'https://cdn.niftyleague.com/media/img/games/smashers/smashers-poster.jpg',
      fetchpriority: 'high',
    })
  })

  it('forwards sizes for responsive preloads', () => {
    const link = buildImagePreloadLink('/img/banner.webp', { sizes: '100vw' })

    expect(link.imagesizes).toBe('100vw')
  })
})
