import { useRef } from 'react'
import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const state = {
  nearViewport: true,
  reducedMotion: false,
  observedRootMargin: undefined as string | undefined,
}

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: (_ref: unknown, rootMargin?: string) => {
    state.observedRootMargin = rootMargin
    return state.nearViewport
  },
}))
mock.module('@nl/ui/hooks/useMediaQuery', () => ({
  default: () => state.reducedMotion,
}))
describe('ViewportVideo', () => {
  let ViewportVideo: typeof import('./index').ViewportVideo
  let ViewportVideoEnhancer: typeof import('./ViewportVideoEnhancer').default

  beforeEach(() => {
    state.nearViewport = true
    state.reducedMotion = false
    state.observedRootMargin = undefined
  })

  beforeEach(async () => {
    ViewportVideo = (await import('./index')).ViewportVideo
    ViewportVideoEnhancer = (await import('./ViewportVideoEnhancer')).default
  })

  it('keeps the video markup server-rendered before playback enhancement', async () => {
    state.nearViewport = false
    const { container, unmount } = render(
      <ViewportVideo data-testid="video" src="/video/example.mp4" muted loop playsInline />
    )
    const video = container.querySelector('[data-testid="video"]') as HTMLVideoElement

    expect(video.autoplay).toBe(false)
    expect(video.preload).toBe('none')
    expect(video.querySelector('source')?.getAttribute('src')).toBe('/video/example.mp4')

    await waitFor(() => expect(state.observedRootMargin).toBe('0px'))
    unmount()
  })

  it('waits for the viewport by default while preserving explicit prefetch windows', async () => {
    const { rerender } = render(<ViewportVideo data-testid="video" src="/video/example.mp4" />)

    await waitFor(() => expect(state.observedRootMargin).toBe('0px'))

    rerender(<ViewportVideo data-testid="video" rootMargin="300px" src="/video/example.mp4" />)

    await waitFor(() => expect(state.observedRootMargin).toBe('300px'))
  })

  it('only enables playback and metadata loading near the viewport', async () => {
    function PlaybackHarness() {
      const videoRef = useRef<HTMLVideoElement>(null)

      return (
        <>
          <video data-testid="video" ref={videoRef} />
          <ViewportVideoEnhancer
            isNearViewport={state.nearViewport}
            playOnViewport
            videoRef={videoRef}
          />
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

  it('keeps controls-only videos paused while still allowing explicit playback', async () => {
    function PlaybackHarness() {
      const videoRef = useRef<HTMLVideoElement>(null)

      return (
        <>
          <video data-testid="video" ref={videoRef} />
          <ViewportVideoEnhancer
            isNearViewport={state.nearViewport}
            playOnViewport={false}
            videoRef={videoRef}
          />
        </>
      )
    }

    const { container } = render(<PlaybackHarness />)
    const video = container.querySelector('[data-testid="video"]') as HTMLVideoElement

    await waitFor(() => {
      expect(video.autoplay).toBe(false)
      expect(video.preload).toBe('metadata')
    })
  })

  it('honors reduced-motion preferences even when visible', async () => {
    state.reducedMotion = true
    function PlaybackHarness() {
      const videoRef = useRef<HTMLVideoElement>(null)

      return (
        <>
          <video ref={videoRef} />
          <ViewportVideoEnhancer
            isNearViewport={state.nearViewport}
            playOnViewport
            videoRef={videoRef}
          />
        </>
      )
    }

    const { container } = render(<PlaybackHarness />)
    const video = container.querySelector('video') as HTMLVideoElement

    await waitFor(() => {
      expect(video.autoplay).toBe(false)
      expect(video.preload).toBe('metadata')
    })
  })
})
