import { describe, expect, it } from 'bun:test'

import { getOptimizedImageProps } from './Image'
import { selectWidths } from './image-url'
import imageService from './image-service'

describe('optimizer width ladder', () => {
  it('never exceeds the intrinsic width of the asset', () => {
    const widths = selectWidths(824, '(max-width: 768px) 100vw, 824px')
    expect(Math.max(...widths)).toBeLessThanOrEqual(824)
    expect(widths.length).toBeGreaterThan(1)
  })

  it('caps the hero wordmark by its CSS box, not its intrinsic width', () => {
    // The wordmark renders at `width: 400px; max-width: 70vw` (Header
    // index.module.css); its sizes must describe that box or the browser
    // downloads a rung twice the size it renders. Keep this literal in sync
    // with HERO_ARTWORK in components/Header/index.tsx.
    const sizes = '(max-width: 571px) 70vw, 400px'
    const widths = selectWidths(824, sizes)
    expect(widths).toEqual([640])
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
    expect(props.fetchpriority).toBe('high')
  })

  it('marks ordinary images lazy with a low fetch priority', () => {
    const props = getOptimizedImageProps({ src: '/img/a.webp' })
    expect(props.loading).toBe('lazy')
    expect(props.fetchpriority).toBe('low')
  })

  it('keeps every source on its original URL', () => {
    // The deploy has no optimizer endpoint: plain asset paths everywhere.
    const remote = getOptimizedImageProps({ src: 'https://cdn.example/a.webp' })
    expect(remote.src).toBe('https://cdn.example/a.webp')
    expect(remote.srcSet).toBeUndefined()

    const local = getOptimizedImageProps({ src: '/img/a.webp' })
    expect(local.src).toBe('/img/a.webp')
    expect(local.srcSet).toBeUndefined()
  })

  it('gives a fill image the absolute-inset style instead of dimensions', () => {
    const props = getOptimizedImageProps({ src: '/img/a.webp', fill: true })
    expect(props.width).toBeUndefined()
    expect(props.height).toBeUndefined()
    expect(props.style).toMatchObject({ position: 'absolute', inset: 0 })
  })
})

describe('astro:assets image service', () => {
  it('resolves the same candidate as the OptimizedImage adapter', () => {
    // The Base.astro preload hint goes through the service while the header
    // <img> goes through the adapter; when the two disagreed, the hero
    // wordmark was downloaded twice. Both sides must resolve the plain asset
    // path and emit no srcset.
    const shared = {
      src: '/img/logos/smashers/app_wordmark_logo.webp',
      width: 824,
      sizes: '(max-width: 571px) 70vw, 400px',
      quality: 85,
    } as const

    const widths = selectWidths(shared.width, shared.sizes)
    const validated = imageService.validateOptions!(
      { src: shared.src, width: widths.at(-1) as number, quality: shared.quality },
      { service: { config: { sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840] } } } as never
    )
    const hint = {
      href: imageService.getURL!(validated as never),
      imageSrcSet: imageService.getSrcSet!(validated as never, undefined as never)
        .map((entry) => `${imageService.getURL!(entry.transform as never)} ${entry.descriptor}`)
        .join(', '),
    }
    const element = getOptimizedImageProps({ ...shared, alt: '' })

    expect(hint.href).toBe(element.src)
    expect(hint.imageSrcSet).toBe(element.srcset ?? '')
  })

  it('keeps every source the service cannot optimize on its original URL', () => {
    for (const src of ['/icons/user.svg', 'https://cdn.example/a.webp', '/_astro/bundled.webp']) {
      const validated = imageService.validateOptions!({ src, width: 640 }, undefined as never) as {
        src: string
      }
      expect(imageService.getURL!(validated)).toBe(src)
      expect(imageService.getSrcSet!(validated as never, undefined as never)).toEqual([])
    }
  })

  it('defaults the optimizer quality to the app ladder, not the generic default', () => {
    const validated = imageService.validateOptions!(
      { src: '/img/a.webp', width: 1080 },
      undefined as never
    ) as {
      quality: number
    }
    expect(validated.quality).toBe(75)
  })
})
