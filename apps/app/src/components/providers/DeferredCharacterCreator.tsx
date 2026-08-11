'use client'

import { useEffect, useState, type ComponentType } from 'react'

import { Button } from '@nl/ui/base/button'

import MintNetworkBoundary from './MintNetworkBoundary'

type CharacterCreatorProps = {
  setLoaded: (loaded: boolean) => void
  setProgress: (progress: number) => void
}

type CharacterCreatorComponent = ComponentType<CharacterCreatorProps>

const loadCharacterCreator = () => import('@/app/(public-routes)/mint-o-matic/_CharacterCreator')

interface DeferredCharacterCreatorProps extends CharacterCreatorProps {
  enabled: boolean
}

export default function DeferredCharacterCreator({
  enabled,
  setLoaded,
  setProgress,
}: DeferredCharacterCreatorProps) {
  const [CharacterCreator, setCharacterCreator] = useState<CharacterCreatorComponent | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!enabled || CharacterCreator) return

    let active = true
    setLoadError(false)

    loadCharacterCreator()
      .then(({ default: nextCharacterCreator }) => {
        if (active) setCharacterCreator(() => nextCharacterCreator)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [enabled, CharacterCreator, retryCount])

  if (!enabled) return null

  if (loadError) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
        <p>Character creator could not be loaded.</p>
        <Button
          type="button"
          variant="link"
          className="text-primary underline underline-offset-4"
          onClick={() => {
            setLoadError(false)
            setRetryCount((count) => count + 1)
          }}
        >
          Retry
        </Button>
      </div>
    )
  }

  if (!CharacterCreator) return null

  return (
    <MintNetworkBoundary>
      <CharacterCreator setLoaded={setLoaded} setProgress={setProgress} />
    </MintNetworkBoundary>
  )
}
