import { IconButton } from '@mui/material';
import { Icon } from '@nl/ui/base/icon';
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog';
import ChangeProfileNameForm from './ChangeProfileNameForm';

interface ChangeProfileNameDialogProps {
  handleUpdateNewName: (newName: string) => void;
}
const ChangeProfileNameDialog = ({ handleUpdateNewName }: ChangeProfileNameDialogProps): React.ReactNode => (
  <Dialog>
    <DialogTrigger>
      <IconButton sx={{ cursor: 'pointer' }} aria-label="edit">
        <Icon name="pencil" />
      </IconButton>
    </DialogTrigger>
    <DialogContent
      aria-labelledby="customized-dialog-title"
      dialogTitle="Update your username"
      sx={{ '& h2': { textAlign: 'center' }, '& .MuiDialogContent-root': { width: '300px' } }}
    >
      <ChangeProfileNameForm updateNewName={handleUpdateNewName} />
    </DialogContent>
  </Dialog>
);

export default ChangeProfileNameDialog;
