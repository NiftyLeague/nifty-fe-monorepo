import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

import { LEGGIES } from '@/constants/degens'

let DegenImage: typeof import('./DegenImage').default

beforeEach(async () => {
  mock.module('@nl/ui/custom/native-image', () => ({
    default: ({ src }: { src: string }) => <div data-native-image data-src={src} />,
  }))
  mock.module('@nl/ui/custom/deferred-animated-image', () => ({
    default: ({ animatedSrc, src }: { animatedSrc: string; src: string }) => (
      <div data-deferred-animated-image data-animated-src={animatedSrc} data-poster-src={src} />
    ),
  }))
  DegenImage = (await import('./DegenImage')).default
})

const assetPath = (tokenId: number, extension: 'gif' | 'webp') =>
  fileURLToPath(
    new URL(`../../../../../../assets/img/degens/nfts/${tokenId}.${extension}`, import.meta.url)
  )

afterEach(() => {
  document.body.innerHTML = ''
  mock.restore()
})

describe('DegenImage', () => {
  it('keeps animated cards on a static poster until deferred activation', () => {
    const { container } = render(<DegenImage tokenId={150} deferAnimation />)
    const image = container.querySelector('[data-deferred-animated-image]')

    expect(image?.getAttribute('data-poster-src')).toBe('/img/degens/nfts/150.webp')
    expect(image?.getAttribute('data-animated-src')).toBe('/img/degens/nfts/150.gif')
  })

  it('preserves direct GIF rendering for dashboard and detail callers', () => {
    const { container } = render(<DegenImage tokenId={150} />)

    expect(container.querySelector('[data-native-image]')?.getAttribute('data-src')).toBe(
      '/img/degens/nfts/150.gif'
    )
  })

  it('keeps a static poster alongside every animated Degen asset', () => {
    expect(
      LEGGIES.every(
        (tokenId) => existsSync(assetPath(tokenId, 'gif')) && existsSync(assetPath(tokenId, 'webp'))
      )
    ).toBe(true)
  })
})
