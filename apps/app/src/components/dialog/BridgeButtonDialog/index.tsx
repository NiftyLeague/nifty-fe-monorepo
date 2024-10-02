'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog';
import BridgeForm from './BridgeForm';
import BridgeSuccess from './BridgeSuccess';

type BridgeButtonDialogProps = { balance: number; loading: boolean };

const BridgeButtonDialog = ({ balance, loading }: BridgeButtonDialogProps) => {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const onCloseBridgeDialog = () => {}; // handle actions if needed

  const onBridgeSuccess = () => setSuccessDialogOpen(true);

  return (
    <>
      <Dialog onClose={onCloseBridgeDialog}>
        <DialogTrigger>
          <Button fullWidth variant="contained" disabled={loading || balance < 0.5}>
            Bridge
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-labelledby="bridge-nftl-dialog"
          dialogTitle="Bridge NFTL to Immutable"
          sx={{
            '& h2': { textAlign: 'center' },
            '& .MuiDialogContent-root': { textAlign: 'center' },
          }}
        >
          <BridgeForm balance={balance} onBridgeSuccess={onBridgeSuccess} />
        </DialogContent>
      </Dialog>
      <BridgeSuccess successDialogOpen={successDialogOpen} setSuccessDialogOpen={setSuccessDialogOpen} />
    </>
  );
};

export default BridgeButtonDialog;
