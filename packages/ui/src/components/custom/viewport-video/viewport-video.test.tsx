import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const state = { nearViewport: true, reducedMotion: false }

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: () => state.nearViewport,
}))
mock.module('@nl/ui/hooks/useMediaQuery', () => ({
  default: () => state.reducedMotion,
}))

describe('ViewportVideo', () => {
  let ViewportVideo: typeof import('./index').ViewportVideo

  beforeEach(() => {
    state.nearViewport = true
    state.reducedMotion = false
  })

  beforeEach(async () => {
    ViewportVideo = (await import('./index')).ViewportVideo
  })

  it('only enables playback and metadata loading near the viewport', () => {
    const { rerender } = render(
      <ViewportVideo data-testid="video" src="/video/example.mp4" muted loop playsInline />
    )
    const video = document.querySelector('[data-testid="video"]') as HTMLVideoElement

    expect(video.autoplay).toBe(true)
    expect(video.preload).toBe('metadata')
    expect(video.querySelector('source')?.getAttribute('src')).toBe('/video/example.mp4')

    state.nearViewport = false
    rerender(<ViewportVideo data-testid="video" src="/video/example.mp4" />)
    expect(video.autoplay).toBe(false)
    expect(video.preload).toBe('none')
  })

  it('honors reduced-motion preferences even when visible', () => {
    state.reducedMotion = true
    const { container } = render(<ViewportVideo src="/video/example.mp4" />)
    const video = container.querySelector('video') as HTMLVideoElement

    expect(video.autoplay).toBe(false)
    expect(video.preload).toBe('none')
  })
})
