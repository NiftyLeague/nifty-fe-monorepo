'use client'

import { Button } from '@nl/ui/base/button'
import DeferredComponent from '@nl/ui/custom/deferred-component'

import MintNetworkBoundary from './MintNetworkBoundary'

type CharacterCreatorProps = {
  setLoaded: (loaded: boolean) => void
  setProgress: (progress: number) => void
}

const loadCharacterCreator = async () => {
  const { default: CharacterCreator } =
    await import('@/app/(public-routes)/mint-o-matic/_CharacterCreator')

  return {
    default: (props: CharacterCreatorProps) => (
      <MintNetworkBoundary>
        <CharacterCreator {...props} />
      </MintNetworkBoundary>
    ),
  }
}

interface DeferredCharacterCreatorProps extends CharacterCreatorProps {
  enabled: boolean
}

export default function DeferredCharacterCreator({
  enabled,
  setLoaded,
  setProgress,
}: DeferredCharacterCreatorProps) {
  return (
    <DeferredComponent
      enabled={enabled}
      label="Character creator"
      load={loadCharacterCreator}
      props={{ setLoaded, setProgress }}
      errorFallback={(onRetry) => (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
          <p>Character creator could not be loaded.</p>
          <Button
            type="button"
            variant="link"
            className="text-primary underline underline-offset-4"
            onClick={onRetry}
          >
            Retry
          </Button>
        </div>
      )}
    />
  )
}
