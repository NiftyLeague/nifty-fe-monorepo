'use client'

import { useEffect, useState, type ComponentType } from 'react'

import { Button } from '@nl/ui/base/button'

import type { PublicDegen } from '@/types/degens'
import DeferredDialogLoading from './DeferredDialogLoading'

interface PublicDegenDialogProps {
  open: boolean
  degen?: Pick<PublicDegen, 'id' | 'name' | 'owner' | 'traits_string'>
  onClose: () => void
}

type PublicDegenDialogComponent = ComponentType<PublicDegenDialogProps>

const loadPublicDegenDialog = () => import('@/components/dialog/PublicDegenDialog')

export default function DeferredPublicDegenDialog({
  open,
  degen,
  onClose,
}: PublicDegenDialogProps) {
  const [Dialog, setDialog] = useState<PublicDegenDialogComponent | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!open || Dialog) return

    let active = true
    setLoadError(false)

    loadPublicDegenDialog()
      .then(({ default: nextDialog }) => {
        if (active) setDialog(() => nextDialog)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })

    return () => {
      active = false
    }
  }, [Dialog, open, retryCount])

  if (!open) return null

  if (loadError) {
    return (
      <div className="flex min-h-24 flex-col items-center justify-center gap-2" role="alert">
        <span>DEGEN details could not be loaded.</span>
        <Button type="button" variant="link" onClick={() => setRetryCount((count) => count + 1)}>
          Retry
        </Button>
      </div>
    )
  }

  if (!Dialog) return <DeferredDialogLoading label="Loading degen details" />

  return <Dialog open={open} degen={degen} onClose={onClose} />
}
