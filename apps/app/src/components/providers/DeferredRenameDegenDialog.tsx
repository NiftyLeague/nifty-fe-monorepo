'use client'

import dynamic from 'next/dynamic'
import type { Degen } from '@/types/degens'

import { Skeleton } from '@nl/ui/base/skeleton'

interface DeferredRenameDegenDialogProps {
  degen?: Degen
  onSuccess?: () => void
}

const DeferredRenameDegenDialog = dynamic<DeferredRenameDegenDialogProps>(
  () => import('@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent'),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-24 items-center justify-center p-4"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Skeleton className="h-10 w-full max-w-sm" />
        <span className="sr-only">Loading rename form</span>
      </div>
    ),
  }
)

export default DeferredRenameDegenDialog
