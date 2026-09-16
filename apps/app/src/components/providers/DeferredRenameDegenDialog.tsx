import DeferredComponent from '@nl/ui/custom/deferred-component'
import type { DashboardDegen } from '@/types/degens'

import DeferredDialogLoading from './DeferredDialogLoading'

interface DeferredRenameDegenDialogProps {
  open?: boolean
  degen?: DashboardDegen
  onSuccess?: () => void
}

const loadRenameDegenDialog = () =>
  import('@/pages/dashboard/degens/_dialogs/RenameDegenDialogContent')

export default function DeferredRenameDegenDialog(props: DeferredRenameDegenDialogProps) {
  const open = () => props.open ?? false
  return (
    <DeferredComponent
      enabled={open()}
      label="DEGEN rename form"
      load={loadRenameDegenDialog}
      loadingFallback={<DeferredDialogLoading label="Loading rename form" />}
      props={{ ...props, open: open() }}
    />
  )
}
