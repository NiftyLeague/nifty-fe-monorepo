import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent } from '@nl/ui/base/dialog'
import { cn } from '@nl/ui/utils'
import type { Item } from '@/types/marketplace'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import ItemDetail from '@/components/cards/ItemDetail'

export interface ViewItemDialogProps {
  item?: Item | null
  subIndex: number
  open: boolean
  onClose: () => void
}

const ViewItemDialog = ({
  item,
  subIndex,
  open,
  onClose,
}: ViewItemDialogProps): React.ReactNode => {
  const fullScreen = useMediaQuery('(max-width:640px)')

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'p-0',
          fullScreen
            ? 'top-0 left-0 h-screen w-screen max-h-screen max-w-none translate-x-0 translate-y-0 rounded-none'
            : 'max-w-[900px] md:max-w-[900px] lg:max-w-[900px]'
        )}
      >
        <div className="flex justify-center p-6">
          {item && <ItemDetail data={item} subIndex={subIndex} />}
        </div>
        <div className="flex items-center gap-2 px-6 pb-6">
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewItemDialog
