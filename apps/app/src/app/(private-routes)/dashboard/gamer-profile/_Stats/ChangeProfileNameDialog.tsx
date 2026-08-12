import { Button } from '@nl/ui/base/button'
import { Pencil } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog'
import ChangeProfileNameForm from './ChangeProfileNameForm'

interface ChangeProfileNameDialogProps {
  handleUpdateNewName: (newName: string) => void
}
const ChangeProfileNameDialog = ({
  handleUpdateNewName,
}: ChangeProfileNameDialogProps): React.ReactNode => (
  <Dialog>
    <DialogTrigger>
      <Button variant="ghost" size="icon" aria-label="edit" className="cursor-pointer">
        <Pencil aria-hidden="true" absoluteStrokeWidth size={20} strokeWidth={1.5} />
      </Button>
    </DialogTrigger>
    <DialogContent dialogTitle="Update your username" sx={{ width: '300px' }}>
      <ChangeProfileNameForm updateNewName={handleUpdateNewName} />
    </DialogContent>
  </Dialog>
)

export default ChangeProfileNameDialog
