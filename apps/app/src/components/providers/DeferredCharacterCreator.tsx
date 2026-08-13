'use client'

import { Button } from '@nl/ui/base/button'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'

import MintNetworkBoundary from './MintNetworkBoundary'

type CharacterCreatorProps = {
  setLoaded: (loaded: boolean) => void
  setProgress: (progress: number) => void
}

const loadCharacterCreator = () => import('@/app/(public-routes)/mint-o-matic/_CharacterCreator')

interface DeferredCharacterCreatorProps extends CharacterCreatorProps {
  enabled: boolean
}

export default function DeferredCharacterCreator({
  enabled,
  setLoaded,
  setProgress,
}: DeferredCharacterCreatorProps) {
  const {
    Component: CharacterCreator,
    hasError: loadError,
    retry,
  } = useDeferredComponent<CharacterCreatorProps>(loadCharacterCreator, enabled)

  if (!enabled) return null

  if (loadError) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
        <p>Character creator could not be loaded.</p>
        <Button
          type="button"
          variant="link"
          className="text-primary underline underline-offset-4"
          onClick={retry}
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
