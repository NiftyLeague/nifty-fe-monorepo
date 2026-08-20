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

  beforeEach(async () => {
    ConsoleGame = (await import('./index')).ConsoleGame
  })

  it('defers the backdrop image while the video remains viewport-aware', () => {
    const { container } = render(<ConsoleGame src="/video/example.mp4" />)
    const image = container.querySelector('img')
    const video = container.querySelector('video')

    expect(image?.getAttribute('loading')).toBe('lazy')
    expect(image?.getAttribute('srcset')).toContain('/_next/image?url=')
    expect(image?.getAttribute('sizes')).toBe('100vw')
    expect(image?.getAttribute('width')).toBe('4842')
    expect(image?.getAttribute('height')).toBe('3371')
    expect(container.querySelectorAll('img[srcset]')).toHaveLength(4)
    expect(video?.getAttribute('preload')).toBe('metadata')
    expect(container.querySelector('.dark-gradient-overlay')).toBeTruthy()
  })

  it('uses the parent visibility state to pause outside the viewport', () => {
    const { container, rerender } = render(
      <ConsoleGame isNearViewport={false} src="/video/example.mp4" />
    )
    const video = container.querySelector('video')

    expect(video?.getAttribute('preload')).toBe('none')
    expect(video?.hasAttribute('autoplay')).toBe(false)

    rerender(<ConsoleGame isNearViewport src="/video/example.mp4" />)
    expect(video?.getAttribute('preload')).toBe('metadata')
    expect(video?.hasAttribute('autoplay')).toBe(true)
  })
})
