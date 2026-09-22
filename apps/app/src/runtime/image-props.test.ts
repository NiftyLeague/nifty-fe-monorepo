import { describe, expect, it } from 'bun:test'

import { candidateWidths, imageProps, selectWidths } from './image-props.mjs'

const MANIFEST = {
  'https://cdn.niftyleague.com/media/img/games/smashers/smashers-poster.jpg': {
    hash: 'abc123',
    width: 1920,
    height: 1080,
  },
}

describe('app image props', () => {
  it('resolves manifest sources to content-addressed variants with a srcSet', () => {
    const props = imageProps(
      {
        src: 'https://cdn.niftyleague.com/media/img/games/smashers/smashers-poster.jpg',
        sizes: '100vw',
        quality: 60,
      },
      MANIFEST
    )

    expect(props.src).toContain('/__images/abc123-')
    expect(props.src?.endsWith('-q60.webp')).toBe(true)
    expect(props.srcSet).toContain('/__images/abc123-384-q60.webp 384w')
    expect(props.srcSet).toContain('1920w')
  })

  it('keeps API-driven and unknown sources on their original URL', () => {
    const props = imageProps(
      { src: 'https://cdn.niftyleague.com/degens/images/bg/md/150.webp', width: 100, height: 100 },
      MANIFEST
    )

    expect(props.src).toBe('https://cdn.niftyleague.com/degens/images/bg/md/150.webp')
    expect(props.srcSet).toBeUndefined()
  })

  it('serves originals when unoptimized is set', () => {
    const props = imageProps(
      {
        src: 'https://cdn.niftyleague.com/media/img/games/smashers/smashers-poster.jpg',
        unoptimized: true,
      },
      MANIFEST
    )

    expect(props.src).toBe(
      'https://cdn.niftyleague.com/media/img/games/smashers/smashers-poster.jpg'
    )
  })

  it('rejects unsafe sources', () => {
    expect(() => imageProps({ src: 'javascript:alert(1)' }, MANIFEST)).toThrow()
    expect(() => imageProps({ src: '//evil.example/img.webp' }, MANIFEST)).toThrow()
  })

  it('picks the two fixed-width rungs for pixel-sized slots', () => {
    const widths = selectWidths(candidateWidths(1920), '300px', undefined)

    expect(widths).toHaveLength(2)
    expect(widths[0]).toBeGreaterThanOrEqual(300)
    expect(widths[1]).toBeGreaterThanOrEqual(600)
  })
})
