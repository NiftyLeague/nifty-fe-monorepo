import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const useOnScreen = mock(() => false)
mock.module('@nl/ui/hooks/useOnScreen', () => ({ useOnScreen }))

describe('DeferredYouTubeEmbed', () => {
  let DeferredYouTubeEmbed: typeof import('./index').DeferredYouTubeEmbed

  beforeEach(async () => {
    useOnScreen.mockImplementation(() => false)
    DeferredYouTubeEmbed = (await import('./index')).DeferredYouTubeEmbed
  })

  it('keeps below-fold embeds out of the initial DOM with an accessible fallback', () => {
    const { container } = render(
      <DeferredYouTubeEmbed src="https://www.youtube.com/embed/example" title="Game trailer" />
    )

    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getByRole('status', { name: 'Loading Game trailer' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Watch Game trailer on YouTube' })).toBeTruthy()
    expect(useOnScreen).toHaveBeenCalledWith(expect.anything(), '160px', { once: true })
  })

  it('mounts the native lazy iframe once the embed is near the viewport', () => {
    useOnScreen.mockImplementation(() => true)

    const { container } = render(
      <DeferredYouTubeEmbed src="about:blank" title="Game trailer" />
    )
    const iframe = container.querySelector('iframe')

    expect(iframe?.getAttribute('src')).toBe('about:blank')
    expect(iframe?.getAttribute('loading')).toBe('lazy')
    expect(iframe?.getAttribute('title')).toBe('Game trailer')
    expect(screen.queryByRole('status')).toBeNull()
  })
})
