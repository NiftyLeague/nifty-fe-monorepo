import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

describe('AnimatedImage', () => {
  let AnimatedImage: typeof import('./index').AnimatedImage

  beforeEach(async () => {
    AnimatedImage = (await import('./index')).AnimatedImage
  })

  it('keeps a native fallback alongside the optimized animated source', () => {
    const { container } = render(
      <AnimatedImage
        src="/img/items/full/1.gif"
        webpSrc="/img/items/full/1.webp"
        alt="Cape"
        width={98}
        height={98}
        loading="lazy"
        unoptimized
      />
    )
    const picture = container.querySelector('picture')

    expect(picture?.querySelector('source')?.getAttribute('type')).toBe('image/webp')
    expect(picture?.querySelector('source')?.getAttribute('srcset')).toBe('/img/items/full/1.webp')
    expect(picture?.querySelector('img')?.getAttribute('src')).toBe('/img/items/full/1.gif')
    expect(picture?.querySelector('img')?.getAttribute('alt')).toBe('Cape')
    expect(picture?.querySelector('img')?.getAttribute('loading')).toBe('lazy')
    expect(picture?.querySelector('img')?.getAttribute('fetchpriority')).toBe('low')
    expect(picture?.querySelector('img')?.getAttribute('decoding')).toBe('async')
  })

  it('preserves an explicit fetch priority for important animated media', () => {
    const { container } = render(
      <AnimatedImage
        src="/img/items/full/1.gif"
        webpSrc="/img/items/full/1.webp"
        alt="Cape"
        width={98}
        height={98}
        loading="lazy"
        fetchPriority="high"
        unoptimized
      />
    )

    expect(container.querySelector('img')?.getAttribute('fetchpriority')).toBe('high')
  })

  it('positions the picture wrapper when using fill sizing', () => {
    const { container } = render(
      <AnimatedImage src="/img/items/full/1.gif" alt="Cape" fill sizes="100vw" unoptimized />
    )
    const picture = container.querySelector('picture')

    expect(picture?.style.position).toBe('absolute')
    expect(picture?.style.inset).toBe('0')
    expect(picture?.style.display).toBe('block')
    expect(picture?.querySelector('img')?.style.height).toBe('100%')
  })
})
