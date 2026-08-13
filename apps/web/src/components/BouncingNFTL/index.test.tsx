import { render } from '@testing-library/react'
import { createElement, type ComponentProps } from 'react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('next/image', () => ({
  default: ({ alt, ...props }: ComponentProps<'img'>) => createElement('img', { alt, ...props }),
}))

describe('BouncingNFTL', () => {
  let BouncingNFTL: typeof import('./index').default

  beforeEach(async () => {
    BouncingNFTL = (await import('./index')).default
  })

  it('renders only the requested token artwork', () => {
    const { container } = render(<BouncingNFTL visibleTokens={['token1', 'token3']} />)

    expect(
      [...container.querySelectorAll('img')].map((image) => image.getAttribute('src'))
    ).toEqual([
      '/img/compete-and-earn/animated/token-1.webp',
      '/img/compete-and-earn/animated/token-3.webp',
    ])
  })
})
