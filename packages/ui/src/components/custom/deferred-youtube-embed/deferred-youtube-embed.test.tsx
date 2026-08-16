import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const useOnScreen = mock(() => false)
mock.module('@nl/ui/hooks/useOnScreen', () => ({ useOnScreen }))

describe('DeferredYouTubeEmbed', () => {
  let DeferredYouTubeEmbed: typeof import('./index').DeferredYouTubeEmbed

  beforeEach(async () => {
    useOnScreen.mockClear()
    useOnScreen.mockReturnValue(false)
    DeferredYouTubeEmbed = (await import('./index')).DeferredYouTubeEmbed
  })

  it('keeps the third-party iframe out of the initial markup with an accessible activation shell', () => {
    const { container } = render(
      <DeferredYouTubeEmbed
        src="https://www.youtube.com/embed/example123"
        title="Example game trailer"
        className="aspect-video"
      />
    )

    expect(container.querySelector('iframe')).toBeNull()
    expect(screen.getByRole('button', { name: 'Load Example game trailer video' })).toBeTruthy()
    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      'https://i.ytimg.com/vi/example123/hqdefault.jpg'
    )
    expect(useOnScreen).toHaveBeenCalledWith(expect.anything(), '200px 0px', { once: true })
  })

  it('loads the iframe when the visitor activates the player', () => {
    const { container } = render(
      <DeferredYouTubeEmbed src="about:blank" title="Example game trailer" />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Load Example game trailer video' }))

    expect(container.querySelector('iframe')?.getAttribute('src')).toBe('about:blank')
    expect(screen.queryByRole('button', { name: 'Load Example game trailer video' })).toBeNull()
  })
})
