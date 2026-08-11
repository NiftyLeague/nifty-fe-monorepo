'use client'

import dynamic from 'next/dynamic'
import type { Degen } from '@/types/degens'

import DeferredDialogLoading from './DeferredDialogLoading'

interface DeferredRenameDegenDialogProps {
  degen?: Degen
  onSuccess?: () => void
}

const DeferredRenameDegenDialog = dynamic<DeferredRenameDegenDialogProps>(
  () => import('@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent'),
  {
    ssr: false,
    loading: () => <DeferredDialogLoading label="Loading rename form" />,
  }
)

export default DeferredRenameDegenDialog
