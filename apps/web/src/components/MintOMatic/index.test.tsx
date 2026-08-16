import { render } from '@testing-library/react'
import { createElement, type ComponentProps } from 'react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/parallax-wrapper', () => ({
  ParallaxWrapper: ({
    children,
    parallaxDirection: _direction,
    parallaxIntensity: _intensity,
    ...props
  }: ComponentProps<'div'>) => createElement('div', props, children),
}))

describe('MintOMatic', () => {
  it('keeps deferred artwork lazy and layout-stable', async () => {
    const MintOMatic = (await import('./index')).default
    const { container } = render(<MintOMatic />)
    const images = [...container.querySelectorAll('img')]

    expect(images).toHaveLength(4)
    expect(images.map((image) => image.getAttribute('loading'))).toEqual(Array(4).fill('lazy'))
    expect(images.map((image) => image.getAttribute('decoding'))).toEqual(Array(4).fill('async'))
    expect(
      images.map((image) => [image.getAttribute('width'), image.getAttribute('height')])
    ).toEqual(Array(4).fill(['1470', '1778']))
  })
})
