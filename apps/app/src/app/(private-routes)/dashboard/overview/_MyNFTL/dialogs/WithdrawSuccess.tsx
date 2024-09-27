import type { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  color: theme.palette.grey[500],
}));

type WithdrawSuccessProps = { successDialogOpen: boolean; setSuccessDialogOpen: Dispatch<SetStateAction<boolean>> };

const WithdrawSuccess = ({ successDialogOpen, setSuccessDialogOpen }: WithdrawSuccessProps): JSX.Element => {
  return (
    <Dialog
      open={successDialogOpen}
      onClose={() => setSuccessDialogOpen(false)}
      aria-labelledby="alert-dialog-withdraw-success"
      aria-describedby="alert-dialog-withdraw-success"
    >
      <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
        {'Success!'}
        <IconButtonStyle aria-label="close" onClick={() => setSuccessDialogOpen(false)}>
          <CloseIcon />
        </IconButtonStyle>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          NFTL has been sent to your <strong>Immutable zkEVM</strong> wallet!
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawSuccess;
