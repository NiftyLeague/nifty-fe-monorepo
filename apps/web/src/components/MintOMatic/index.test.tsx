import { render } from '@testing-library/react'
import { createElement, type ComponentProps } from 'react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('next/image', () => ({
  default: ({ alt, ...props }: ComponentProps<'img'>) => createElement('img', { alt, ...props }),
}))

mock.module('@nl/ui/custom/parallax-wrapper', () => ({
  ParallaxWrapper: ({
    children,
    parallaxDirection: _direction,
    parallaxIntensity: _intensity,
    ...props
  }: ComponentProps<'div'>) => createElement('div', props, children),
}))

describe('MintOMatic', () => {
  it('requests image variants that match its responsive column width', async () => {
    const MintOMatic = (await import('./index')).default
    const { container } = render(<MintOMatic />)

    expect(
      [...container.querySelectorAll('img')].map((image) => image.getAttribute('sizes'))
    ).toEqual(Array(4).fill('(min-width: 768px) 50vw, 100vw'))
  })
})
