'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { Skeleton } from '@nl/ui/base/skeleton'
import { useOnScreen } from '@nl/ui/hooks/useOnScreen'

import type { ConsoleGameProps } from '../console-game'

interface DeferredConsoleGameProps {
  src: string
}

type ConsoleGameComponent = ComponentType<ConsoleGameProps>

const DeferredConsoleGame = ({ src }: DeferredConsoleGameProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useOnScreen(rootRef, '200px')
  const [ConsoleGame, setConsoleGame] = useState<ConsoleGameComponent | null>(null)

  useEffect(() => {
    if (!isNearViewport) return

    let cancelled = false
    void import('../console-game').then(({ ConsoleGame: LoadedConsoleGame }) => {
      if (!cancelled) setConsoleGame(() => LoadedConsoleGame)
    })

    return () => {
      cancelled = true
    }
  }, [isNearViewport])

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
