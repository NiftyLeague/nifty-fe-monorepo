'use client'

import { memo, useRef, type ReactNode } from 'react'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

import type { ConsoleGameProps } from '../console-game'

interface DeferredConsoleGameProps {
  children: ReactNode
  src: string
}

// Avoid downloading multi-megabyte game video when only a few pixels of the
// section are visible at the bottom of a marketing page's initial viewport.
const CONSOLE_GAME_ROOT_MARGIN = '0px 0px -25% 0px'

const loadConsoleGame = () =>
  import('../console-game').then(({ ConsoleGame }) => ({ default: ConsoleGame }))

const DeferredConsoleGame = memo(function DeferredConsoleGame({
  children,
  src,
}: DeferredConsoleGameProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  // Keep the interactive video chunk out of the initial page load until the
  // preview actually intersects the viewport.
  const isNearViewport = useOnScreen(rootRef, CONSOLE_GAME_ROOT_MARGIN)
  const { Component: ConsoleGame } = useDeferredComponent<ConsoleGameProps>(
    loadConsoleGame,
    isNearViewport
  )

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden"
      // The shared backdrop is 4842x3371, not 16:9. Keeping its native ratio
      // reserves the full art-directed frame before the deferred client chunk loads.
      style={{ aspectRatio: '4842 / 3371' }}
    >
      {ConsoleGame ? (
        <ConsoleGame isNearViewport={isNearViewport} src={src}>
          {children}
        </ConsoleGame>
      ) : (
        children
      )}
    </div>
  )
})

export { DeferredConsoleGame }
export default DeferredConsoleGame
