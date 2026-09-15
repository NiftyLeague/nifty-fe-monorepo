import { createEffect, createSignal, onCleanup, Show, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import type { ViewportVideoProps } from './index'
import type { ViewportVideoEnhancerProps } from './ViewportVideoEnhancer'
import { DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN } from './constants'

const DEFERRED_VIDEO_LOAD_DELAY_MS = 750

const loadEnhancer = () =>
  import('./ViewportVideoEnhancer').then((module) => ({ default: module.default }))

function scheduleDeferredLoad(callback: () => void): () => void {
  let idleCallbackId: number | undefined
  const delayId = window.setTimeout(() => {
    if ('requestIdleCallback' in window) {
      idleCallbackId = window.requestIdleCallback(callback, { timeout: 1500 })
      return
    }

    callback()
  }, DEFERRED_VIDEO_LOAD_DELAY_MS)

  return () => {
    window.clearTimeout(delayId)
    if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(idleCallbackId)
    }
  }
}

export default function ViewportVideoBoundary(props: ViewportVideoProps) {
  const [local, others] = splitProps(props, ['deferLoad', 'playOnViewport', 'rootMargin', 'src'])
  const deferLoad = () => local.deferLoad ?? false
  const playOnViewport = () => local.playOnViewport ?? true
  const rootMargin = () => local.rootMargin ?? DEFAULT_VIEWPORT_VIDEO_ROOT_MARGIN

  let videoEl: HTMLVideoElement | undefined
  const [hasEnteredViewport, setHasEnteredViewport] = createSignal(false)
  const isNearViewport = useOnScreen(() => videoEl, rootMargin())
  const shouldRenderMedia = () => hasEnteredViewport() || (isNearViewport() && !deferLoad())

  const { Component: Enhancer } = useDeferredComponent<ViewportVideoEnhancerProps>(
    loadEnhancer,
    shouldRenderMedia
  )

  createEffect(() => {
    if (!isNearViewport() || hasEnteredViewport()) return
    if (!deferLoad()) {
      setHasEnteredViewport(true)
      return
    }

    const cleanup = scheduleDeferredLoad(() => setHasEnteredViewport(true))
    onCleanup(cleanup)
  })

  return (
    <>
      <video
        {...others}
        ref={(el) => (videoEl = el)}
        preload={shouldRenderMedia() && isNearViewport() ? 'metadata' : 'none'}
      >
        {shouldRenderMedia() ? <source src={local.src} type="video/mp4" /> : null}
      </video>
      <Show when={shouldRenderMedia() && Enhancer()}>
        {(Loaded) => (
          <Dynamic
            component={Loaded()}
            isNearViewport={isNearViewport()}
            playOnViewport={playOnViewport()}
            videoRef={() => videoEl}
          />
        )}
      </Show>
    </>
  )
}
