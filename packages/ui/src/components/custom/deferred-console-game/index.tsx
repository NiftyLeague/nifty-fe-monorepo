'use client'

import { memo, useEffect, useRef, useState, type ReactNode } from 'react'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'
import { scheduleDeferredActivation } from '@nl/ui/lib/deferred-activation'

import type { ConsoleGameProps } from '../console-game'

interface DeferredConsoleGameProps {
  children: ReactNode
  /** Keep the interactive video out of the first idle window after it is visible. */
  deferVideo?: boolean
  src: string
}

// Avoid downloading multi-megabyte game video when only a few pixels of the
// section are visible at the bottom of a marketing page's initial viewport.
const CONSOLE_GAME_ROOT_MARGIN = '0px 0px -25% 0px'

const loadConsoleGame = () =>
  import('../console-game').then(({ ConsoleGame }) => ({ default: ConsoleGame }))

const DeferredConsoleGame = memo(function DeferredConsoleGame({
  children,
  deferVideo = false,
  src,
}: DeferredConsoleGameProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  // Keep the interactive console chunk out of the initial page load until the
  // preview is visible and the shared activation window allows non-critical
  // media. The server-rendered backdrop remains visible while it waits.
  const isNearViewport = useOnScreen(rootRef, CONSOLE_GAME_ROOT_MARGIN)
  const [videoActivated, setVideoActivated] = useState(!deferVideo)
  const shouldLoadInteractiveGame = isNearViewport && (!deferVideo || videoActivated)
  const { Component: ConsoleGame } = useDeferredComponent<ConsoleGameProps>(
    loadConsoleGame,
    shouldLoadInteractiveGame
  )

  useEffect(() => {
    if (!deferVideo || !isNearViewport || videoActivated) return

    return scheduleDeferredActivation({
      onActivate: () => setVideoActivated(true),
    })
  }, [deferVideo, isNearViewport, videoActivated])

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden"
      // The shared backdrop is 4842x3371, not 16:9. Keeping its native ratio
      // reserves the full art-directed frame before the deferred client chunk loads.
      style={{ aspectRatio: '4842 / 3371' }}
    >
      {ConsoleGame ? (
        <ConsoleGame
          isNearViewport={isNearViewport && videoActivated}
          renderGradientOverlay={false}
          src={src}
        >
          {children}
        </ConsoleGame>
      ) : (
        children
      )}
      <div className="dark-gradient-overlay" />
    </div>
  )
})

export { DeferredConsoleGame }
export default DeferredConsoleGame
