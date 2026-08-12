import { useRef } from 'react'
import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const state = { nearViewport: true, reducedMotion: false }

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: () => state.nearViewport,
}))
mock.module('@nl/ui/hooks/useMediaQuery', () => ({
  default: () => state.reducedMotion,
}))
mock.module('next/dynamic', () => ({ default: () => () => null }))

describe('ViewportVideo', () => {
  let ViewportVideo: typeof import('./index').ViewportVideo
  let ViewportVideoEnhancer: typeof import('./ViewportVideoEnhancer').default

  beforeEach(() => {
    state.nearViewport = true
    state.reducedMotion = false
  })

  beforeEach(async () => {
    ViewportVideo = (await import('./index')).ViewportVideo
    ViewportVideoEnhancer = (await import('./ViewportVideoEnhancer')).default
  })

  it('keeps the video markup server-rendered before playback enhancement', () => {
    const { container } = render(
      <ViewportVideo data-testid="video" src="/video/example.mp4" muted loop playsInline />
    )
    const video = container.querySelector('[data-testid="video"]') as HTMLVideoElement

    expect(video.autoplay).toBe(false)
    expect(video.preload).toBe('none')
    expect(video.querySelector('source')?.getAttribute('src')).toBe('/video/example.mp4')
  })

  it('only enables playback and metadata loading near the viewport', async () => {
    function PlaybackHarness() {
      const videoRef = useRef<HTMLVideoElement>(null)

      return (
        <>
          <video data-testid="video" ref={videoRef} />
          <ViewportVideoEnhancer rootMargin="300px" videoRef={videoRef} />
        </>
      )
    }

    const { container, unmount } = render(<PlaybackHarness />)
    const video = container.querySelector('[data-testid="video"]') as HTMLVideoElement

    await waitFor(() => {
      expect(video.autoplay).toBe(true)
      expect(video.preload).toBe('metadata')
    })

    state.nearViewport = false
    unmount()
    const deferred = render(<PlaybackHarness />)
    const deferredVideo = deferred.container.querySelector(
      '[data-testid="video"]'
    ) as HTMLVideoElement

    await waitFor(() => {
      expect(deferredVideo.autoplay).toBe(false)
      expect(deferredVideo.preload).toBe('none')
    })
  })

  it('honors reduced-motion preferences even when visible', async () => {
    state.reducedMotion = true
    function PlaybackHarness() {
      const videoRef = useRef<HTMLVideoElement>(null)

      return (
        <>
          <video ref={videoRef} />
          <ViewportVideoEnhancer rootMargin="300px" videoRef={videoRef} />
        </>
      )
    }

    const { container } = render(<PlaybackHarness />)
    const video = container.querySelector('video') as HTMLVideoElement

    await waitFor(() => {
      expect(video.autoplay).toBe(false)
      expect(video.preload).toBe('none')
    })
  })
})
