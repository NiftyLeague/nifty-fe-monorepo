import NativeImage from '@nl/ui/custom/native-image'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent } from '@nl/ui/base/dialog'
import { cn } from '@nl/ui/utils'
import type { Comic } from '@/types/marketplace'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

interface ViewComicDialogProps {
  comic?: Comic | null
  open: boolean
  onClose: () => void
}

const ViewComicDialog = ({ comic, open, onClose }: ViewComicDialogProps): JSX.Element => {
  const fullScreen = useMediaQuery('(max-width:640px)')

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        class={cn(
          'p-0',
          fullScreen
            ? 'top-0 left-0 h-screen w-screen max-h-screen max-w-none translate-x-0 translate-y-0 rounded-none'
            : 'max-w-[900px] md:max-w-[900px] lg:max-w-[900px]'
        )}
      >
        <div class="flex justify-center p-6">
          {comic?.image ? (
            <NativeImage
              src={comic.image}
              alt={`Comic: ${comic?.title}`}
              width={500}
              height={500}
              style={{ width: fullScreen ? '100%' : 500, height: 'auto' }}
            />
          ) : null}
        </div>
        <div class="flex items-center gap-2 px-6 pb-6">
          <Button variant="ghost" class="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewComicDialog
