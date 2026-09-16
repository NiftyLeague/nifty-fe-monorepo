import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogTitle } from '@nl/ui/base/dialog'
import DeferredComponent from '@nl/ui/custom/deferred-component'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { cn } from '@nl/ui/utils'
import type { JSX } from 'solid-js'

const loadTermsOfServiceContent = () => import('./TermsOfServiceContent')

interface TermsOfServiceDialogProps {
  open: boolean
  onClose: (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel'
  ) => void
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  scroll?: 'body' | 'paper'
  fullScreen?: boolean
  className?: string
  children?: JSX.Element
}

const TermsOfServiceDialog = (props: TermsOfServiceDialogProps) => {
  const fullScreen = useMediaQuery('(max-width:768px)')

  return (
    <Dialog
      open={props.open}
      onOpenChange={(isOpen) => {
        if (!isOpen) props.onClose({}, 'escapeKeyDown')
      }}
    >
      <DialogContent
        showCloseButton={false}
        class={cn(
          'p-0 max-w-150 md:max-w-150 lg:max-w-150',
          fullScreen() &&
            'top-0 left-0 h-screen w-screen max-h-screen max-w-none translate-x-0 translate-y-0 rounded-none'
        )}
      >
        <DialogTitle class="sr-only">Terms and Conditions</DialogTitle>
        <div class="flex h-full w-full flex-col overflow-hidden">
          <h2 class="mb-5 text-center">Terms and Conditions</h2>
          <div
            class={`w-full overflow-x-hidden overflow-y-scroll ${fullScreen() ? 'h-[calc(100vh-184px)]' : 'h-(--tos-h)'}`}
            style={fullScreen() ? undefined : { '--tos-h': '65vh' }}
          >
            <DeferredComponent
              enabled={props.open}
              label="Terms and conditions"
              load={loadTermsOfServiceContent}
              props={{}}
            />
          </div>
          <div class="mt-3 flex gap-2 px-4">
            <Button variant="default" class="w-full" onClick={() => props.onClose({}, 'accepted')}>
              Accept
            </Button>
            <Button variant="ghost" class="w-full" onClick={() => props.onClose({}, 'cancel')}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TermsOfServiceDialog
