import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';
import { Alert, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Typography } from '@mui/material';

import { Icon } from '@nl/ui/base/icon';
import useTokensBalances from '@/hooks/balances/useTokensBalances';
import useNetworkContext from '@/hooks/useNetworkContext';
import { AXELAR_TRANSACTIONS_URL } from '@/constants/url';

type BridgeSuccessProps = { successDialogOpen: boolean; setSuccessDialogOpen: Dispatch<SetStateAction<boolean>> };

const BridgeSuccess = ({ successDialogOpen, setSuccessDialogOpen }: BridgeSuccessProps): React.ReactNode => {
  const { address } = useNetworkContext();
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
        Success!
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 0, top: 0 }}>
          <Icon name="x" size="lg" color="dim" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body1" align="center" sx={{ width: '100%', mb: 2 }}>
            NFTL has been sent to your <strong>Immutable zkEVM</strong> wallet!
          </Typography>
          <span>
            <Alert severity="info">
              Please Note: Axelar bridge transactions take 20 minutes to process.
              <br />
              You can check your bridge transactions here:{' '}
              <Link
                href={AXELAR_TRANSACTIONS_URL(address as `0x${string}`)}
                target="_blank"
                rel="noreferrer"
                color="secondary"
                style={{ fontWeight: 800 }}
              >
                Axelarscan
              </Link>
            </Alert>
          </span>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default BridgeSuccess;
