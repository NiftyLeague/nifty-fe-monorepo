import { createEffect, createSignal, onCleanup, Show, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

import type { ConsoleGameProps } from '../console-game'

interface DeferredConsoleGameProps {
  children: JSX.Element
  /** Keep the interactive video out of the first idle window after it is visible. */
  deferVideo?: boolean
  /**
   * Load the interactive chunk (backdrop, controllers, controls) as soon as the
   * section nears the viewport instead of waiting for the activation window.
   * Opt-in so existing consumers keep their current load timing.
   */
  loadInteractiveOnViewport?: boolean
  /** Override the shared activation delay for this section, in milliseconds. */
  activationDelay?: number
  src: string
}

// Avoid downloading multi-megabyte game video when only a few pixels of the
// section are visible at the bottom of a marketing page's initial viewport.
const CONSOLE_GAME_ROOT_MARGIN = '0px 0px -25% 0px'

const loadConsoleGame = () =>
  import('../console-game').then(({ ConsoleGame }) => ({ default: ConsoleGame }))

const DeferredConsoleGame = (props: DeferredConsoleGameProps) => {
  let rootEl: HTMLDivElement | undefined
  // Keep the interactive console chunk out of the initial page load until the
  // preview is visible and the shared activation window allows non-critical
  // media. The server-rendered backdrop remains visible while it waits.
  const isNearViewport = useOnScreen(() => rootEl, CONSOLE_GAME_ROOT_MARGIN)
  const [videoActivated, setVideoActivated] = createSignal(!(props.deferVideo ?? false))
  // Consumers that opt in load the interactive chunk (backdrop, controllers,
  // bonk sticker) as soon as the section approaches the viewport, leaving only
  // the video source behind the activation window so multi-megabyte files do
  // not race the page's own critical content. Default keeps the previous
  // activation-gated behaviour for other apps.
  const shouldLoadInteractiveGame = () =>
    props.loadInteractiveOnViewport
      ? isNearViewport()
      : isNearViewport() && (!props.deferVideo || videoActivated())
  const { Component: ConsoleGame } = useDeferredComponent<ConsoleGameProps>(
    loadConsoleGame,
    shouldLoadInteractiveGame
  )

  createEffect(() => {
    if (!props.deferVideo || !isNearViewport() || videoActivated()) return

    const cleanup = scheduleDeferredActivation({
      onActivate: () => setVideoActivated(true),
      ...(props.activationDelay === undefined ? {} : { delay: props.activationDelay }),
    })
    onCleanup(cleanup)
  })

  return (
    <div
      ref={(el) => (rootEl = el)}
      class="relative overflow-hidden"
      // The shared backdrop is 4842x3371, not 16:9. Keeping its native ratio
      // reserves the full art-directed frame before the deferred client chunk loads.
      style={{ 'aspect-ratio': '4842 / 3371' }}
    >
      <Show when={ConsoleGame()} fallback={props.children}>
        {(Loaded) => (
          <Dynamic
            component={Loaded()}
            isNearViewport={isNearViewport() && videoActivated()}
            renderGradientOverlay={false}
            src={props.src}
          >
            {props.children}
          </Dynamic>
        )}
      </Show>
      <div class="dark-gradient-overlay" />
    </div>
  )
}

export { DeferredConsoleGame }
export default DeferredConsoleGame
