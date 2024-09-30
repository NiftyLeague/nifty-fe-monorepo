import type { Dispatch, SetStateAction } from 'react';
import { Alert, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useTokensBalances from '@/hooks/balances/useTokensBalances';

const IconButtonStyle = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  color: theme.palette.grey[500],
}));

type BridgeSuccessProps = { successDialogOpen: boolean; setSuccessDialogOpen: Dispatch<SetStateAction<boolean>> };

const BridgeSuccess = ({ successDialogOpen, setSuccessDialogOpen }: BridgeSuccessProps): JSX.Element => {
  const { refreshNFTLBalance } = useTokensBalances();

  const handleClose = () => {
    refreshNFTLBalance();
    setSuccessDialogOpen(false);
  };

  return (
    <Dialog
      open={successDialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-bridge-success"
      aria-describedby="alert-dialog-bridge-success"
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
          <Alert severity="info">Please Note: Bridge transactions take 20 minutes to process</Alert>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default BridgeSuccess;
