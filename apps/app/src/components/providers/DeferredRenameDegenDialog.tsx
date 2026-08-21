'use client'

import DeferredComponent from '@nl/ui/custom/deferred-component'
import type { DashboardDegen } from '@/types/degens'

import DeferredDialogLoading from './DeferredDialogLoading'

interface DeferredRenameDegenDialogProps {
  open?: boolean
  degen?: DashboardDegen
  onSuccess?: () => void
}

const loadRenameDegenDialog = () =>
  import('@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent')

export default function DeferredRenameDegenDialog({
  open = false,
  ...props
}: DeferredRenameDegenDialogProps) {
  return (
    <DeferredComponent
      enabled={open}
      label="DEGEN rename form"
      load={loadRenameDegenDialog}
      loadingFallback={<DeferredDialogLoading label="Loading rename form" />}
      props={props}
    />
  )
}
