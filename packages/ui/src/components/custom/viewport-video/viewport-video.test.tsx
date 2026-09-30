import { render, waitFor } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const state = {
  nearViewport: true,
  reducedMotion: false,
  observedRootMargin: undefined as string | undefined,
}

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: (_ref: unknown, rootMargin?: string) => {
    state.observedRootMargin = rootMargin
    return () => state.nearViewport
  },
}))
mock.module('@nl/ui/hooks/useMediaQuery', () => ({
  default: () => () => state.reducedMotion,
}))

function PlaybackHarness(props: {
  playOnViewport?: boolean
  enhancer: typeof import('./ViewportVideoEnhancer').default
}) {
  let videoEl: HTMLVideoElement | undefined

  return (
    <>
      <video data-testid="video" ref={(el) => (videoEl = el)} />
      <props.enhancer
        isNearViewport={state.nearViewport}
        playOnViewport={props.playOnViewport}
        videoRef={() => videoEl}
      />
    </>
  )
}
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

  const renderPlaybackHarness = (props: { playOnViewport?: boolean }) =>
    render(() => (
      <PlaybackHarness playOnViewport={props.playOnViewport} enhancer={ViewportVideoEnhancer} />
    ))

  it('keeps the video shell server-rendered and adds media only near the viewport', async () => {
    state.nearViewport = false
    const deferred = render(() => (
      <ViewportVideo
        data-testid="video"
        src="https://cdn.niftyleague.com/media/video/arcade-token.mp4"
        muted
        loop
        playsinline
      />
    ))
    const video = deferred.container.querySelector('[data-testid="video"]') as HTMLVideoElement

    expect(video.autoplay).toBe(false)
    expect(video.preload).toBe('none')
    expect(video.querySelector('source')).toBeNull()

    await waitFor(() => expect(state.observedRootMargin).toBe('0px 0px -25% 0px'))

    deferred.unmount()
    state.nearViewport = true
    const nearViewport = render(() => (
      <ViewportVideo
        data-testid="video"
        src="https://cdn.niftyleague.com/media/video/arcade-token.mp4"
        muted
        loop
        playsinline
      />
    ))

    await waitFor(() =>
      expect(
        nearViewport.container.querySelector('[data-testid="video"] source')?.getAttribute('src')
      ).toBe('https://cdn.niftyleague.com/media/video/arcade-token.mp4')
    )
    nearViewport.unmount()
  })

  it('waits for the viewport by default while preserving explicit prefetch windows', async () => {
    const first = render(() => (
      <ViewportVideo
        data-testid="video"
        src="https://cdn.niftyleague.com/media/video/arcade-token.mp4"
      />
    ))

    await waitFor(() => expect(state.observedRootMargin).toBe('0px 0px -25% 0px'))
    first.unmount()

    render(() => (
      <ViewportVideo
        data-testid="video"
        rootMargin="300px"
        src="https://cdn.niftyleague.com/media/video/arcade-token.mp4"
      />
    ))

    await waitFor(() => expect(state.observedRootMargin).toBe('300px'))
  })

  it('can defer an above-the-fold video until the browser is idle', async () => {
    const deferred = render(() => (
      <ViewportVideo
        data-testid="video"
        deferLoad
        poster="/img/video-poster.webp"
        src="https://cdn.niftyleague.com/media/video/arcade-token.mp4"
      />
    ))
    const video = deferred.container.querySelector('[data-testid="video"]') as HTMLVideoElement

    expect(video.getAttribute('deferload')).toBeNull()
    expect(video.getAttribute('poster')).toBe('/img/video-poster.webp')
    expect(video.querySelector('source')).toBeNull()

    await waitFor(
      () =>
        expect(video.querySelector('source')?.getAttribute('src')).toBe(
          'https://cdn.niftyleague.com/media/video/arcade-token.mp4'
        ),
      { timeout: 2000 }
    )
    deferred.unmount()
  })

  it('only enables playback and metadata loading near the viewport', async () => {
    const { container, unmount } = renderPlaybackHarness({ playOnViewport: true })
    const video = container.querySelector('[data-testid="video"]') as HTMLVideoElement

    await waitFor(() => {
      expect(video.autoplay).toBe(true)
      expect(video.preload).toBe('metadata')
    })

    state.nearViewport = false
    unmount()
    const deferred = renderPlaybackHarness({})
    const deferredVideo = deferred.container.querySelector(
      '[data-testid="video"]'
    ) as HTMLVideoElement

    await waitFor(() => {
      expect(deferredVideo.autoplay).toBe(false)
      expect(deferredVideo.preload).toBe('none')
    })
  })

  it('keeps controls-only videos paused while still allowing explicit playback', async () => {
    const { container } = renderPlaybackHarness({})
    const video = container.querySelector('[data-testid="video"]') as HTMLVideoElement

    await waitFor(() => {
      expect(video.autoplay).toBe(false)
      expect(video.preload).toBe('metadata')
    })
  })

  it('honors reduced-motion preferences even when visible', async () => {
    state.reducedMotion = true
    const { container } = renderPlaybackHarness({ playOnViewport: true })
    const video = container.querySelector('video') as HTMLVideoElement

    await waitFor(() => {
      expect(video.autoplay).toBe(false)
      expect(video.preload).toBe('metadata')
    })
  })
})
