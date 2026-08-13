'use client'

import { useRef } from 'react'
import { Skeleton } from '@nl/ui/base/skeleton'
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
    <div ref={rootRef} className="relative aspect-video overflow-hidden">
      {ConsoleGame ? (
        <ConsoleGame isNearViewport={isNearViewport} src={src} />
      ) : (
        <Skeleton
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
