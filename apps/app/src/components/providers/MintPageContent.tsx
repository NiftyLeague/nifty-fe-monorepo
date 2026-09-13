'use client'

import { useState } from 'react'

import { ErrorBoundary } from '@nl/ui/custom/error-boundry'
import { Preloader } from '@nl/ui/custom/preloader'

import DeferredCharacterCreator from './DeferredCharacterCreator'

export default function MintPageContent() {
  const [isLoaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)

  return (
    <div style={{ textAlign: 'center', overflowX: 'hidden' }}>
      <ErrorBoundary>
        <Preloader ready={isLoaded} progress={progress} />
        <DeferredCharacterCreator enabled setLoaded={setLoaded} setProgress={setProgress} />
      </ErrorBoundary>
    </div>
  )
}
