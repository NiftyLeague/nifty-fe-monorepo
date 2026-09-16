import DeferredComponent from '@nl/ui/custom/deferred-component'
import type { PublicDegen } from '@/types/degens'
import DeferredDialogLoading from './DeferredDialogLoading'

interface PublicDegenDialogProps {
  open: boolean
  degen?: Pick<PublicDegen, 'id' | 'name' | 'owner' | 'traits_string'>
  onClose: () => void
}

const loadPublicDegenDialog = () => import('@/components/dialog/PublicDegenDialog')

export default function DeferredPublicDegenDialog(props: PublicDegenDialogProps) {
  const open = () => props.open
  return (
    <DeferredComponent
      enabled={open()}
      label="DEGEN details"
      load={loadPublicDegenDialog}
      loadingFallback={<DeferredDialogLoading label="Loading degen details" />}
      props={{ ...props, open: open() }}
    />
  )
}
