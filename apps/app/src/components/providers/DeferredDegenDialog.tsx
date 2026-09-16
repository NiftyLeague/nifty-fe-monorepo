import DeferredComponent from '@nl/ui/custom/deferred-component'

import type { DegenDialogProps } from '@/components/dialog/DegenDialog'
import DeferredDialogLoading from './DeferredDialogLoading'

const loadDegenDialog = () => import('@/components/dialog/DegenDialog')

export default function DeferredDegenDialog(props: DegenDialogProps) {
  const open = () => props.open ?? false
  return (
    <DeferredComponent
      enabled={open()}
      label="DEGEN details"
      load={loadDegenDialog}
      loadingFallback={<DeferredDialogLoading label="Loading degen details" />}
      props={{ ...props, open: open() }}
    />
  )
}
