import { render } from '@nl/ui/test-utils'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

import { CDN_BASE_URL } from '@/constants/api'
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

afterEach(() => {
  document.body.innerHTML = ''
  mock.restore()
})

describe('DegenImage', () => {
  it('keeps animated cards on a static poster until deferred activation', () => {
    const { container } = render(() => <DegenImage tokenId={150} deferAnimation />)
    const image = container.querySelector('[data-deferred-animated-image]')

    expect(image?.getAttribute('data-poster-src')).toBe(
      `${CDN_BASE_URL}/degens/images/bg/sm/150.webp`
    )
    expect(image?.getAttribute('data-animated-src')).toBe(
      `${CDN_BASE_URL}/degens/images/bg/md/150.webp`
    )
  })

  it('serves every token from the CDN WebP set', () => {
    const { container } = render(() => <DegenImage tokenId={150} />)

    expect(container.querySelector('[data-native-image]')?.getAttribute('data-src')).toBe(
      `${CDN_BASE_URL}/degens/images/bg/md/150.webp`
    )
  })

  it('treats legendaries and Hydras as animated', () => {
    expect(LEGGIES.includes(150)).toBe(true)
    expect(LEGGIES.includes(9924)).toBe(true)
  })
})
