import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import NativeImage from './index'

describe('NativeImage', () => {
  it('keeps image semantics and lazy loading without Next image props', () => {
    const { container } = render(
      <NativeImage
        src="/img/logos/NL/purple-filled.webp"
        alt="Nifty League"
        width={32}
        height={31}
        priority
        unoptimized
      />
    )
    const image = container.querySelector('img')

    expect(image?.getAttribute('src')).toBe('/img/logos/NL/purple-filled.webp')
    expect(image?.getAttribute('alt')).toBe('Nifty League')
    expect(image?.getAttribute('loading')).toBe('eager')
    expect(image?.getAttribute('decoding')).toBe('async')
    expect(image?.getAttribute('fetchpriority')).toBeNull()
    expect(image?.getAttribute('unoptimized')).toBeNull()
  })

  it('preserves fill layout geometry on the native element', () => {
    const { container } = render(
      <NativeImage fill src="/img/degens/nfts/1.webp" alt="Degen" sizes="100vw" />
    )
    const image = container.querySelector('img')

    expect(image?.style.position).toBe('absolute')
    expect(image?.style.inset).toBe('0')
    expect(image?.style.width).toBe('100%')
    expect(image?.style.height).toBe('100%')
    expect(image?.getAttribute('sizes')).toBe('100vw')
    expect(image?.getAttribute('loading')).toBe('lazy')
    expect(image?.getAttribute('fetchpriority')).toBe('low')
  })

  it('preserves an explicit fetch priority', () => {
    const { container } = render(
      <NativeImage src="/img/logos/NL/purple-filled.webp" alt="Nifty League" fetchPriority="high" />
    )
    const image = container.querySelector('img')

    expect(image?.getAttribute('fetchpriority')).toBe('high')
  })
})
