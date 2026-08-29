import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const state = {
  nearViewport: false,
  rootMargin: undefined as string | undefined,
}

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: (_ref: unknown, rootMargin: string) => {
    state.rootMargin = rootMargin
    return state.nearViewport
  },
}))

describe('DeferredAnimatedImage', () => {
  let DeferredAnimatedImage: typeof import('./index').DeferredAnimatedImage

  beforeEach(async () => {
    state.nearViewport = false
    state.rootMargin = undefined
    DeferredAnimatedImage = (await import('./index')).DeferredAnimatedImage
  })

  it('keeps the animated source out of the initial render while retaining the poster', () => {
    const { container } = render(
      <DeferredAnimatedImage
        src="/poster.webp"
        webpSrc="/animation.webp"
        webpMedia="(prefers-reduced-motion: no-preference)"
        alt="Party modes"
        width={1350}
        height={566}
        loading="lazy"
        containerClassName="my-10 block"
      />
    )

    expect(container.querySelector('source')).toBeNull()
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/poster.webp')
    expect(container.querySelector('img')?.getAttribute('loading')).toBe('lazy')
    expect(container.firstElementChild?.className).toBe('my-10 block')
    expect(container.firstElementChild?.getAttribute('aria-busy')).toBe('true')
    expect(state.rootMargin).toBe('160px')
  })

  it('attaches the animated source when the poster is near the viewport', () => {
    state.nearViewport = true

    const { container } = render(
      <DeferredAnimatedImage
        src="/poster.webp"
        webpSrc="/animation.webp"
        webpMedia="(prefers-reduced-motion: no-preference)"
        alt="Party modes"
        width={1350}
        height={566}
        loading="lazy"
      />
    )

    expect(container.querySelector('source')?.getAttribute('srcset')).toBe('/animation.webp')
    expect(container.querySelector('source')?.getAttribute('media')).toBe(
      '(prefers-reduced-motion: no-preference)'
    )
    expect(container.firstElementChild?.getAttribute('aria-busy')).toBe('false')
  })

  it('defers non-WebP media while keeping its static fallback', () => {
    state.nearViewport = false

    const { container } = render(
      <DeferredAnimatedImage
        src="/poster.webp"
        animatedSrc="/animation.gif"
        animatedType="image/gif"
        alt="Animated roadmap art"
        width={1350}
        height={566}
      />
    )

    expect(container.querySelector('source')).toBeNull()
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/poster.webp')

    state.nearViewport = true
    const rerendered = render(
      <DeferredAnimatedImage
        src="/poster.webp"
        animatedSrc="/animation.gif"
        animatedType="image/gif"
        alt="Animated roadmap art"
        width={1350}
        height={566}
      />
    )

    expect(rerendered.container.querySelector('source')?.getAttribute('type')).toBe('image/gif')
    expect(rerendered.container.querySelector('source')?.getAttribute('srcset')).toBe(
      '/animation.gif'
    )
  })
})
