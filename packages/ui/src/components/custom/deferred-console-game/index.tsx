'use client'

import { useRef } from 'react'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

import type { ConsoleGameProps } from '../console-game'

interface DeferredConsoleGameProps {
  src: string
}

const loadConsoleGame = () =>
  import('../console-game').then(({ ConsoleGame }) => ({ default: ConsoleGame }))

const DeferredConsoleGame = ({ src }: DeferredConsoleGameProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(rootRef, '200px')
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
        <ConsoleGame isNearViewport={isNearViewport} src={src} />
      ) : (
        <DeferredSkeleton
          role="img"
          aria-label="Loading game preview"
          className="absolute inset-0 h-full w-full rounded-none"
        />
      )}
    </div>
  )
}

export { DeferredConsoleGame }
export default DeferredConsoleGame
