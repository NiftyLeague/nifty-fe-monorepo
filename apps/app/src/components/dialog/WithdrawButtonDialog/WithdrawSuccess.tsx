import type { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import Icon from '@nl/ui/base/Icon';
import useTokensBalances from '@/hooks/balances/useTokensBalances';

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
        Success!
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 0, top: 0 }}>
          <Icon name="x" size="lg" color="dim" />
        </IconButton>
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
