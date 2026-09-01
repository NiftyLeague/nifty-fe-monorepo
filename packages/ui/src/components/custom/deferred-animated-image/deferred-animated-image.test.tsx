import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const state = {
  nearViewport: false,
  animationActivated: false,
  rootMargin: undefined as string | undefined,
  activationEnabled: false,
  activationDelay: undefined as number | undefined,
}

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: (_ref: unknown, rootMargin: string) => {
    state.rootMargin = rootMargin
    return state.nearViewport
  },
}))

mock.module('@nl/ui/hooks/useDeferredActivation', () => ({
  default: ({ enabled, delay }: { enabled: boolean; delay?: number }) => {
    state.activationEnabled = enabled
    state.activationDelay = delay
    return enabled && state.animationActivated
  },
}))

describe('DeferredAnimatedImage', () => {
  let DeferredAnimatedImage: typeof import('./index').DeferredAnimatedImage

  const setSaveData = (enabled: boolean) => {
    Object.defineProperty(globalThis.navigator, 'connection', {
      configurable: true,
      value: enabled ? { saveData: true } : undefined,
    })
  }

  beforeEach(async () => {
    state.nearViewport = false
    state.animationActivated = false
    state.rootMargin = undefined
    state.activationEnabled = false
    state.activationDelay = undefined
    setSaveData(false)
    DeferredAnimatedImage = (await import('./index')).DeferredAnimatedImage
  })

  it('keeps the animated source out of the initial render while retaining the poster', () => {
    const { container } = render(
      <DeferredAnimatedImage
        src="/poster.webp"
        animatedSrc="/animation.webp"
        animatedType="image/webp"
        animatedMedia="(prefers-reduced-motion: no-preference)"
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
        animatedSrc="/animation.webp"
        animatedType="image/webp"
        animatedMedia="(prefers-reduced-motion: no-preference)"
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

  it('keeps animated sources detached when the browser requests reduced data', () => {
    state.nearViewport = true
    setSaveData(true)

    const { container } = render(
      <DeferredAnimatedImage
        src="/poster.webp"
        animatedSrc="/animation.webp"
        animatedType="image/webp"
        fallbackAnimatedSrc="/animation.gif"
        fallbackAnimatedType="image/gif"
        alt="Party modes"
        width={1350}
        height={566}
      />
    )

    expect(container.querySelectorAll('source')).toHaveLength(0)
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/poster.webp')
    expect(container.firstElementChild?.getAttribute('aria-busy')).toBe('false')
  })

  it('keeps heavy animation deferred until shared idle activation', () => {
    state.nearViewport = true

    const rendered = render(
      <DeferredAnimatedImage
        src="/poster.webp"
        animatedSrc="/animation.webp"
        alt="Party modes"
        width={1350}
        height={566}
        deferAnimation
        activationDelay={1000}
      />
    )

    expect(rendered.container.querySelector('source')).toBeNull()
    expect(rendered.container.querySelector('img')?.getAttribute('src')).toBe('/poster.webp')
    expect(rendered.container.firstElementChild?.getAttribute('aria-busy')).toBe('true')
    expect(state.activationEnabled).toBe(true)
    expect(state.activationDelay).toBe(1000)

    state.animationActivated = true
    rendered.rerender(
      <DeferredAnimatedImage
        src="/poster.webp"
        animatedSrc="/animation.webp"
        alt="Party modes"
        width={1350}
        height={566}
        deferAnimation
        activationDelay={1001}
      />
    )

    expect(rendered.container.querySelector('source')?.getAttribute('srcset')).toBe(
      '/animation.webp'
    )
    expect(rendered.container.firstElementChild?.getAttribute('aria-busy')).toBe('false')
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

  it('attaches preferred and compatibility sources together only near the viewport', () => {
    const props = {
      src: '/img/items/thumbnail/1.webp',
      animatedSrc: '/img/items/full/1.webp',
      animatedType: 'image/webp',
      fallbackAnimatedSrc: '/img/items/full/1.gif',
      fallbackAnimatedType: 'image/gif',
      alt: 'Cape',
      width: 98,
      height: 98,
    }

    const initial = render(<DeferredAnimatedImage {...props} />)

    expect(initial.container.querySelectorAll('source')).toHaveLength(0)
    expect(initial.container.querySelector('img')?.getAttribute('src')).toBe(
      '/img/items/thumbnail/1.webp'
    )

    state.nearViewport = true
    const nearViewport = render(<DeferredAnimatedImage {...props} />)

    const sources = [...nearViewport.container.querySelectorAll('source')]
    expect(sources).toHaveLength(2)
    expect(sources[0]?.getAttribute('srcset')).toBe('/img/items/full/1.webp')
    expect(sources[1]?.getAttribute('srcset')).toBe('/img/items/full/1.gif')
  })
})
