'use client'

import { useEffect, useState, type ComponentType } from 'react'

import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'

type MintPageContent = ComponentType

const loadMintPageContent = () => import('./MintPageContent')

export default function DeferredMintPage() {
  const [PageContent, setPageContent] = useState<MintPageContent | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    setPageContent(null)
    setLoadError(false)

    loadMintPageContent()
      .then(({ default: nextPageContent }) => {
        if (active) setPageContent(() => nextPageContent)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [retryCount])

  if (loadError) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3" role="alert">
        <p>Mint page could not be loaded.</p>
        <Button type="button" variant="link" onClick={() => setRetryCount((count) => count + 1)}>
          Retry
        </Button>
      </div>
    )
  }

  if (!PageContent) {
    return (
      <div className="flex min-h-48 items-center justify-center" role="status" aria-live="polite">
        <Skeleton className="h-8 w-32" />
        <span className="sr-only">Loading mint page</span>
      </div>
    )
  }

  return <PageContent />
}
