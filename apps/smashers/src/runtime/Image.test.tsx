import { afterAll, beforeAll, describe, expect, it } from 'bun:test'

import { getImagePreloadProps, getOptimizedImageProps, selectWidths } from './Image'

// The optimizer only runs on Vercel; the URL-shape assertions below describe
// that deployment, so the flag is set for this file.
const previousVercel = process.env.VERCEL
beforeAll(() => {
  process.env.VERCEL = '1'
})
afterAll(() => {
  if (previousVercel === undefined) delete process.env.VERCEL
  else process.env.VERCEL = previousVercel
})

/**
 * The optimizer width ladder is load-bearing for Core Web Vitals: two separate
 * mis-selections (an 1080w request for an 824px asset, and a 3840w request for a
 * full-bleed backdrop on a 390px viewport) both surfaced as LCP regressions
 * rather than as visible bugs. These tests pin the selection rules.
 */
describe('optimizer width ladder', () => {
  it('never exceeds the intrinsic width of the asset', () => {
    const widths = selectWidths(824, '(max-width: 768px) 100vw, 824px')
    expect(Math.max(...widths)).toBeLessThanOrEqual(824)
    expect(widths.length).toBeGreaterThan(1)
  })

  it('caps a full-bleed image by the viewport, not by its native width', () => {
    // The console-game backdrop declares 4842px and is rendered at 100vw.
    const widths = selectWidths(4842, '100vw')
    expect(Math.max(...widths)).toBeLessThanOrEqual(1920)
  })

  it('falls back to the smallest rung for an asset smaller than the ladder', () => {
    expect(selectWidths(22, undefined)).toEqual([640])
  })

  it('lets an unconstrained image use the full ladder', () => {
    expect(selectWidths(undefined, undefined).at(-1)).toBe(3840)
  })

  it('returns a non-empty ladder for every degenerate input', () => {
    for (const [native, sizes] of [
      [undefined, undefined],
      [0, ''],
      [NaN, 'auto'],
      [10, '100vw'],
    ] as const) {
      const widths = selectWidths(native as number | undefined, sizes as string | undefined)
      expect(widths.length).toBeGreaterThan(0)
      expect(widths.every((width) => width > 0)).toBe(true)
    }
  })
})

describe('image props', () => {
  it('rejects a missing or unsafe source', () => {
    expect(() => getOptimizedImageProps({ src: '' })).toThrow()
    expect(() => getOptimizedImageProps({ src: {} } as never)).toThrow()
  })

  it('marks priority images eager with a high fetch priority', () => {
    const props = getOptimizedImageProps({ src: '/img/a.webp', priority: true })
    expect(props.loading).toBe('eager')
    expect(props.fetchPriority).toBe('high')
  })

  it('marks ordinary images lazy with a low fetch priority', () => {
    const props = getOptimizedImageProps({ src: '/img/a.webp' })
    expect(props.loading).toBe('lazy')
    expect(props.fetchPriority).toBe('low')
  })

  it('keeps remote and unoptimized sources on their original URL', () => {
    const remote = getOptimizedImageProps({ src: 'https://cdn.example/a.webp' })
    expect(remote.src).toBe('https://cdn.example/a.webp')
    expect(remote.srcSet).toBeUndefined()

    const unoptimized = getOptimizedImageProps({ src: '/img/a.webp', unoptimized: true })
    expect(unoptimized.src).toBe('/img/a.webp')
  })

  it('gives a fill image the absolute-inset style instead of dimensions', () => {
    const props = getOptimizedImageProps({ src: '/img/a.webp', fill: true })
    expect(props.width).toBeUndefined()
    expect(props.height).toBeUndefined()
    expect(props.style).toMatchObject({ position: 'absolute', inset: 0 })
  })
})

describe('preload hints', () => {
  it('describes the same candidate the element will request', () => {
    // Both sides call selectWidths, so the hint and the <img> cannot diverge;
    // when they did, the hero wordmark was downloaded twice.
    const shared = {
      src: '/img/logos/smashers/app_wordmark_logo.webp',
      width: 824,
      sizes: '(max-width: 768px) 100vw, 824px',
      quality: 85,
    } as const

    const hint = getImagePreloadProps(shared)
    const element = getOptimizedImageProps({ ...shared, alt: '' })

    expect(hint.href).toBe(element.src)
    expect(hint.imageSrcSet).toBe(element.srcSet)
    expect(hint.imageSizes).toBe(element.sizes)
  })

  it('omits a srcset for sources the optimizer does not handle', () => {
    const hint = getImagePreloadProps({ src: 'https://cdn.example/a.webp' })
    expect(hint.href).toBe('https://cdn.example/a.webp')
    expect(hint.imageSrcSet).toBeUndefined()
  })
})
