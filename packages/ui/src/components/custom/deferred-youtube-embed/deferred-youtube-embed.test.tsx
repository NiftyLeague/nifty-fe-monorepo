import { render, screen } from '@testing-library/react'
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

describe('DeferredYouTubeEmbed', () => {
  let DeferredYouTubeEmbed: typeof import('./index').DeferredYouTubeEmbed

  beforeEach(async () => {
    state.nearViewport = false
    state.rootMargin = undefined
    DeferredYouTubeEmbed = (await import('./index')).DeferredYouTubeEmbed
  })

  it('keeps third-party media out of the initial render with an accessible themed shell', () => {
    const { container } = render(
      <DeferredYouTubeEmbed
        src="about:blank"
        title="Example trailer"
        className="h-[315px] w-full"
        style={{ display: 'block', width: '100%', height: 380 }}
      />
    )

    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getByRole('status', { name: 'Loading Example trailer' })).toBeTruthy()
    expect(screen.getByRole('status').className).toContain('h-[315px]')
    expect(screen.getByRole('status').getAttribute('style')).toContain('height: 380px')
    expect(container.firstElementChild?.getAttribute('aria-busy')).toBe('true')
    expect(state.rootMargin).toBe('160px')
  })

  it('mounts the shared accessible iframe once the video is near the viewport', () => {
    state.nearViewport = true

    const { container } = render(
      <DeferredYouTubeEmbed
        src="about:blank"
        title="Example trailer"
        className="h-[315px] w-full"
      />
    )

    const iframe = container.querySelector('iframe')
    expect(iframe).toBeTruthy()
    expect(iframe?.getAttribute('src')).toBe('about:blank')
    expect(iframe?.getAttribute('title')).toBe('Example trailer')
    expect(iframe?.getAttribute('loading')).toBe('lazy')
    expect(iframe?.getAttribute('allow')).toContain('autoplay')
    expect(container.firstElementChild?.getAttribute('aria-busy')).toBe('false')
  })
})
