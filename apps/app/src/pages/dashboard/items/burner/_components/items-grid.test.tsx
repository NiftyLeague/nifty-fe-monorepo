import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@/hooks/balances/useNFTsBalances', () => ({
  default: () => ({ loadingItems: false }),
}))

mock.module('@nl/ui/custom/deferred-skeleton', () => ({
  default: () => null,
}))

mock.module('@nl/ui/custom/deferred-animated-image', () => ({
  DeferredAnimatedImage: ({
    alt,
    animatedSrc,
    fallbackAnimatedSrc,
    src,
  }: {
    alt: string
    animatedSrc?: string
    fallbackAnimatedSrc?: string
    src: string
  }) => (
    <div
      role="img"
      aria-label={alt}
      data-animated-src={animatedSrc}
      data-fallback-animated-src={fallbackAnimatedSrc}
      data-poster-src={src}
    />
  ),
}))

describe('ItemsGrid', () => {
  let ItemsGrid: typeof import('./items-grid').default

  beforeEach(async () => {
    ItemsGrid = (await import('./items-grid')).default
  })

  it('uses shared item metadata and defers full media behind thumbnails', () => {
    render(<ItemsGrid itemCounts={[1, 2, 3, 4, 5, 6, 7]} />)

    const images = screen.getAllByRole('img')

    expect(images).toHaveLength(7)
    expect(images[0]?.getAttribute('aria-label')).toBe('CAPE')
    expect(images[0]?.getAttribute('data-poster-src')).toBe('/img/items/thumbnail/1.webp')
    expect(images[0]?.getAttribute('data-animated-src')).toBe('/img/items/full/1.webp')
    expect(images[0]?.getAttribute('data-fallback-animated-src')).toBe('/img/items/full/1.gif')
    expect(screen.getByText('NL PURPLE')).toBeTruthy()
    expect(screen.getByText('x5')).toBeTruthy()
    expect(images[6]?.getAttribute('aria-label')).toBe('CITADEL KEY')
    expect(images[6]?.getAttribute('data-poster-src')).toBe('/img/items/thumbnail/7.webp')
  })
})
