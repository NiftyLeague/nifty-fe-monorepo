import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogTitle } from '@nl/ui/base/dialog'
import DeferredComponent from '@nl/ui/custom/deferred-component'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { cn } from '@nl/ui/utils'

const loadTermsOfServiceContent = () => import('./TermsOfServiceContent')

export interface TermsOfServiceDialogProps {
  open: boolean
  onClose: (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel'
  ) => void
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  scroll?: 'body' | 'paper'
  fullScreen?: boolean
  className?: string
  children?: React.ReactNode
}

const TermsOfServiceDialog = ({ open, onClose }: TermsOfServiceDialogProps) => {
  const fullScreen = useMediaQuery('(max-width:768px)')

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose({}, 'escapeKeyDown')
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={cn(
          'p-0 max-w-[600px] md:max-w-[600px] lg:max-w-[600px]',
          fullScreen &&
            'top-0 left-0 h-screen w-screen max-h-screen max-w-none translate-x-0 translate-y-0 rounded-none'
        )}
      >
        <DialogTitle className="sr-only">Terms and Conditions</DialogTitle>
        <div className="flex h-full w-full flex-col overflow-hidden">
          <h2 className="mb-5 text-center">Terms and Conditions</h2>
          <div
            className="w-full overflow-x-hidden overflow-y-scroll"
            style={{ height: fullScreen ? 'calc(100vh - 184px)' : '65vh' }}
          >
            <DeferredComponent
              enabled={open}
              label="Terms and conditions"
              load={loadTermsOfServiceContent}
              props={{}}
            />
          </div>
          <div className="mt-3 flex gap-2 px-4">
            <Button variant="default" className="w-full" onClick={() => onClose({}, 'accepted')}>
              Accept
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => onClose({}, 'cancel')}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TermsOfServiceDialog
