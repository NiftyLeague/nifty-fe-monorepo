import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/parallax-wrapper', () => ({
  ParallaxWrapper: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))
mock.module('@nl/ui/custom/optimized-image', () => ({
  default: ({ src, ...props }: React.ComponentProps<'img'>) => (
    <img {...props} src={src} srcSet={`/_next/image?url=${encodeURIComponent(src ?? '')}`} />
  ),
}))
describe('ConsoleGame', () => {
  let ConsoleGame: typeof import('./index').ConsoleGame
  let ConsoleGameBackdrop: typeof import('./backdrop').ConsoleGameBackdrop

  beforeEach(async () => {
    ConsoleGame = (await import('./index')).ConsoleGame
    ConsoleGameBackdrop = (await import('./backdrop')).ConsoleGameBackdrop
  })

  it('defers the backdrop image while the video remains viewport-aware', () => {
    const { container } = render(
      <ConsoleGame src="/video/example.mp4">
        <ConsoleGameBackdrop />
      </ConsoleGame>
    )
    const image = container.querySelector('img')
    const video = container.querySelector('video')

    expect(image?.getAttribute('loading')).toBe('lazy')
    expect(image?.getAttribute('fetchpriority')).toBe('low')
    expect(image?.getAttribute('srcset')).toContain('/_next/image?url=')
    expect(image?.getAttribute('sizes')).toBe('100vw')
    expect(image?.getAttribute('width')).toBe('4842')
    expect(image?.getAttribute('height')).toBe('3371')
    const optimizedArtwork = [...container.querySelectorAll('img[srcset]')]
    expect(optimizedArtwork).toHaveLength(1)
    expect(optimizedArtwork.every((artwork) => artwork.getAttribute('quality') === '65')).toBe(true)
    const deferredArtwork = [...container.querySelectorAll('img')].filter(
      (artwork) => !artwork.hasAttribute('srcset')
    )
    expect(deferredArtwork.map((artwork) => artwork.getAttribute('src'))).toEqual([
      '/img/console-game/bonk.webp',
      '/img/console-game/gaming_controller_left.webp',
      '/img/console-game/gaming_controller_right.webp',
    ])
    expect(deferredArtwork.every((artwork) => artwork.getAttribute('loading') === 'lazy')).toBe(
      true
    )
    expect(
      deferredArtwork.every((artwork) => artwork.getAttribute('fetchpriority') === 'low')
    ).toBe(true)
    expect(video?.getAttribute('preload')).toBe('metadata')
    expect(container.querySelector('.dark-gradient-overlay')).toBeTruthy()
  })

  it('allows the deferred wrapper to own the shared gradient overlay', () => {
    const { container } = render(
      <ConsoleGame renderGradientOverlay={false} src="/video/example.mp4">
        <ConsoleGameBackdrop />
      </ConsoleGame>
    )

    expect(container.querySelector('.dark-gradient-overlay')).toBeNull()
  })

  it('uses the parent visibility state to pause outside the viewport', () => {
    const { container, rerender } = render(
      <ConsoleGame isNearViewport={false} src="/video/example.mp4">
        <ConsoleGameBackdrop />
      </ConsoleGame>
    )
    const video = container.querySelector('video')

    expect(video?.getAttribute('preload')).toBe('none')
    expect(video?.hasAttribute('autoplay')).toBe(false)
    expect(video?.querySelector('source')).toBeNull()

    rerender(
      <ConsoleGame isNearViewport src="/video/example.mp4">
        <ConsoleGameBackdrop />
      </ConsoleGame>
    )
    expect(video?.getAttribute('preload')).toBe('metadata')
    expect(video?.hasAttribute('autoplay')).toBe(true)
    expect(video?.querySelector('source')?.getAttribute('src')).toBe('/video/example.mp4')
  })
})
