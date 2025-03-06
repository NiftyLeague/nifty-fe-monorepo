import { IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useTheme } from '@nl/theme';
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog';
import ChangeProfileNameForm from './ChangeProfileNameForm';

interface ChangeProfileNameDialogProps {
  handleUpdateNewName: (newName: string) => void;
}
const ChangeProfileNameDialog = ({ handleUpdateNewName }: ChangeProfileNameDialogProps): React.ReactNode => {
  const theme = useTheme();
  return (
    <Dialog>
      <DialogTrigger>
        <IconButton
          sx={{
            cursor: 'pointer',
          }}
          aria-label="edit"
        >
          <EditOutlinedIcon
            fontSize="small"
            sx={{
              color: theme.palette.grey[400],
            }}
          />
        </IconButton>
      </DialogTrigger>
      <DialogContent
        aria-labelledby="customized-dialog-title"
        dialogTitle="Update your username"
        sx={{
          '& h2': {
            textAlign: 'center',
          },
          '& .MuiDialogContent-root': {
            width: '300px',
          },
        }}
      >
        <ChangeProfileNameForm updateNewName={handleUpdateNewName} />
      </DialogContent>
    </Dialog>
  );
};

export default ChangeProfileNameDialog;
