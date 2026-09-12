import { describe, expect, it } from 'bun:test'

import {
  IMAGE_FILL_STYLE,
  imageAttributes,
  imageSource,
  stripUndefinedAttributes,
} from './image-attributes'

/**
 * The attribute contract three surfaces used to implement separately. The
 * optimiser around it is per-app; this is the part that has to behave the same
 * everywhere, so the tests pin the observable attributes rather than the code
 * shape.
 */

describe('imageSource', () => {
  it('accepts a string or an object source', () => {
    expect(imageSource('/img/hero.webp')).toBe('/img/hero.webp')
    expect(imageSource({ src: '/img/hero.webp', width: 800 })).toBe('/img/hero.webp')
  })

  it('refuses a missing or empty source', () => {
    expect(() => imageSource('')).toThrow('Image src is required')
    expect(() => imageSource({ src: '' })).toThrow('Image src is required')
    // @ts-expect-error runtime guard for JS callers
    expect(() => imageSource(undefined)).toThrow('Image src is required')
  })
})

describe('imageAttributes', () => {
  it('defaults to async decoding and lazy loading', () => {
    expect(imageAttributes({ src: '/img/hero.webp' })).toMatchObject({
      decoding: 'async',
      loading: 'lazy',
      src: '/img/hero.webp',
    })
  })

  it('loads eagerly with a high priority hint for priority and preload', () => {
    for (const flag of ['priority', 'preload'] as const) {
      expect(imageAttributes({ src: '/img/hero.webp', [flag]: true })).toMatchObject({
        loading: 'eager',
        fetchPriority: 'high',
      })
    }
  })

  it('marks lazy artwork as low priority and leaves other cases unset', () => {
    expect(imageAttributes({ src: '/img/hero.webp' }).fetchPriority).toBe('low')
    expect(
      imageAttributes({ src: '/img/hero.webp', loading: 'eager' }).fetchPriority
    ).toBeUndefined()
  })

  it('lets the caller override the loader hints', () => {
    const props = imageAttributes({
      src: '/img/hero.webp',
      decoding: 'sync',
      loading: 'eager',
      fetchPriority: 'auto',
    })

    expect(props).toMatchObject({ decoding: 'sync', loading: 'eager', fetchPriority: 'auto' })
  })

  it('adopts the intrinsic size from an object source', () => {
    expect(
      imageAttributes({ src: { src: '/img/hero.webp', width: 1920, height: 1080 } })
    ).toMatchObject({
      width: 1920,
      height: 1080,
    })
  })

  it('keeps an explicit size over the source’s', () => {
    expect(
      imageAttributes({ src: { src: '/img/hero.webp', width: 1920 }, width: 640 })
    ).toMatchObject({ width: 640 })
  })

  it('pins a fill image to its box and drops the intrinsic size', () => {
    const props = imageAttributes({
      src: { src: '/img/hero.webp', width: 1920, height: 1080 },
      fill: true,
      style: { opacity: 0.5 },
    })

    expect(props.width).toBeUndefined()
    expect(props.height).toBeUndefined()
    expect(props.style).toEqual({ ...IMAGE_FILL_STYLE, opacity: 0.5 })
  })

  it('passes through the caller’s attributes', () => {
    expect(
      imageAttributes({ src: '/img/hero.webp', alt: 'Hero', className: 'w-full', sizes: '100vw' })
    ).toMatchObject({ alt: 'Hero', className: 'w-full', sizes: '100vw' })
  })
})

describe('stripUndefinedAttributes', () => {
  it('drops undefined keys and keeps the rest', () => {
    const attributes = { src: '/img/hero.webp', srcSet: undefined, alt: 'Hero', width: 0 }

    expect(stripUndefinedAttributes(attributes)).toEqual({
      src: '/img/hero.webp',
      alt: 'Hero',
      width: 0,
    })
  })
})
