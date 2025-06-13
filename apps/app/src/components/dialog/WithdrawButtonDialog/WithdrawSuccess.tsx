import type { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useTokensBalances from '@/hooks/balances/useTokensBalances';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  color: 'var(--color-foreground-2)',
}));

type WithdrawSuccessProps = { successDialogOpen: boolean; setSuccessDialogOpen: Dispatch<SetStateAction<boolean>> };

const WithdrawSuccess = ({ successDialogOpen, setSuccessDialogOpen }: WithdrawSuccessProps): React.ReactNode => {
  const { refreshNFTLBalance } = useTokensBalances();

  const handleClose = () => {
    refreshNFTLBalance();
    setSuccessDialogOpen(false);
  };

  return (
    <Dialog
      open={successDialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-withdraw-success"
      aria-describedby="alert-dialog-withdraw-success"
    >
      <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
        {'Success!'}
        <IconButtonStyle aria-label="close" onClick={handleClose}>
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
