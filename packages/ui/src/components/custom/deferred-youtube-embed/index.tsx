import { Show, splitProps } from 'solid-js'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { LazyYouTubeEmbed, type LazyYouTubeEmbedProps } from '@nl/ui/custom/lazy-youtube-embed'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

export const DEFAULT_DEFERRED_YOUTUBE_ROOT_MARGIN = '160px'

export type DeferredYouTubeEmbedProps = LazyYouTubeEmbedProps & {
  className?: string
  /** Load the third-party iframe this many pixels before it enters the viewport. */
  rootMargin?: string
  /** Render the iframe in the server-rendered shell while retaining native lazy loading. */
  loadImmediately?: boolean
}

/**
 * Keeps YouTube out of the initial page load until a visitor is close to the
 * video, while preserving the shared iframe's accessible and themed markup.
 */
export function DeferredYouTubeEmbed(props: DeferredYouTubeEmbedProps) {
  const [local, others] = splitProps(props, [
    'rootMargin',
    'loadImmediately',
    'title',
    'class',
    'className',
    'style',
  ])
  let embedEl: HTMLDivElement | undefined
  const isNearViewport = useOnScreen(
    () => embedEl,
    local.rootMargin ?? DEFAULT_DEFERRED_YOUTUBE_ROOT_MARGIN,
    { once: true }
  )
  const shouldRenderEmbed = () => (local.loadImmediately ?? false) || isNearViewport()

  return (
    <div ref={(el) => (embedEl = el)} aria-busy={!shouldRenderEmbed()}>
      <Show
        when={shouldRenderEmbed()}
        fallback={
          <DeferredSkeleton
            role="status"
            aria-live="polite"
            aria-label={`Loading ${local.title}`}
            class={local.class ?? local.className}
            style={local.style}
          />
        }
      >
        <LazyYouTubeEmbed
          {...(others as Record<string, unknown>)}
          src={others.src}
          title={local.title}
          class={local.class ?? local.className}
          style={local.style}
        />
      </Show>
    </div>
  )
}

export default DeferredYouTubeEmbed
