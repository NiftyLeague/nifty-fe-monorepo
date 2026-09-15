import { render } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/parallax-wrapper', () => ({
  ParallaxWrapper: (props: Record<string, unknown>) => {
    const { children, parallaxDirection: _d, parallaxIntensity: _i, ...rest } = props
    return <div {...rest}>{children}</div>
  },
}))

describe('MintOMatic', () => {
  it('prioritizes the hero artwork and keeps the rest lazy and layout-stable', async () => {
    const MintOMatic = (await import('./index')).default
    const { container } = render(() => <MintOMatic />)
    const images = [...container.querySelectorAll('img')]

    expect(images).toHaveLength(4)
    expect(images.map((image) => image.getAttribute('loading'))).toEqual([
      'lazy',
      'lazy',
      'eager',
      'lazy',
    ])
    expect(images.map((image) => image.getAttribute('fetchpriority'))).toEqual([
      'low',
      'low',
      'high',
      'low',
    ])
    expect(images.map((image) => image.getAttribute('decoding'))).toEqual(Array(4).fill('async'))
    expect(
      images.map((image) => [image.getAttribute('width'), image.getAttribute('height')])
    ).toEqual(Array.from({ length: 4 }, () => ['1470', '1778']))
  })
})
