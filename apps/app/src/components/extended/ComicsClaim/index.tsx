'use client';

import { forwardRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  useMediaQuery,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@nl/theme';

import useClaimCallback from '@/hooks/comics/useClaimCallback';
import useUserUnclaimedAmount, { ClaimResult } from '@/hooks/comics/useUserUnclaimedAmount';

import snapshot from './snapshot.json';

const Alert = forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomizedSnackbar({ msg, setDialogOpen }: { msg: string; setDialogOpen: (open: boolean) => void }) {
  const [open, setOpen] = useState(true);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleClose}
      open={open}
      sx={{ backgroundColor: '#191b1f', borderRadius: '8px' }}
    >
      <Alert
        onClose={handleClose}
        variant="outlined"
        severity="warning"
        sx={{ width: '100%', border: 'solid 2px' }}
        action={
          <Button color="inherit" sx={{ marginTop: '-5px', marginRight: '-3px' }} onClick={() => setDialogOpen(true)}>
            claim
          </Button>
        }
      >
        {msg}
      </Alert>
    </Snackbar>
  );
}

const ClaimButton = ({
  setAvailableComics,
  setDialogOpen,
}: {
  setAvailableComics: React.Dispatch<React.SetStateAction<ClaimResult>>;
  setDialogOpen: (string: any) => void;
}): JSX.Element | null => {
  const availableComics = useUserUnclaimedAmount();

  useEffect(() => {
    const result = { p5: availableComics.p5 || 0, p6: availableComics.p6 || 0 };
    setAvailableComics(result);
  }, [availableComics.p5, availableComics.p6, setAvailableComics]);

  if (!availableComics) return null;

  return availableComics?.p5 > 0 || availableComics?.p6 > 0 ? (
    <CustomizedSnackbar
      setDialogOpen={setDialogOpen}
      msg={`You have ${availableComics.p5} page 5s & ${availableComics.p6} page 6s claimable until May 15th`}
    />
  ) : null;
};

function ClaimDialog({
  availableComics,
  dialogOpen,
  setDialogOpen,
}: {
  availableComics: ClaimResult;
  dialogOpen: boolean;
  setDialogOpen: (string: any) => void;
}): JSX.Element {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [checked, setChecked] = useState(false);
  const { claimCallback } = useClaimCallback();

  const onClose = () => setDialogOpen(false);

  const handleToggleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleClaim = async () => {
    await claimCallback();
    setDialogOpen(false);
  };

  return (
    <Dialog
      aria-labelledby="airdrop-claim-dialog"
      fullScreen={fullScreen}
      onClose={onClose}
      open={dialogOpen}
      sx={{ textAlign: 'center' }}
    >
      <DialogTitle id="airdrop-claim-title">
        {availableComics.p5} Page 5s &amp; {availableComics.p6} Page 6s Claimable
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          NOTE: The deadline to claim is <strong>May 15th</strong>. <br />
          🔥 Any leftover comics will be burnt! 🔥
        </DialogContentText>
        <DialogContentText>
          <Checkbox
            checked={checked}
            color="primary"
            inputProps={{ 'aria-label': 'primary checkbox' }}
            onChange={handleToggleChecked}
          />
          Please accept our <Link href="/terms-of-service">Terms of Service</Link> before claiming.
        </DialogContentText>
        {fullScreen && (
          <Button onClick={handleClaim} color="primary" autoFocus disabled={!checked} fullWidth variant="contained">
            Claim
          </Button>
        )}
      </DialogContent>
      {!fullScreen && (
        <DialogActions>
          <Button onClick={handleClaim} color="primary" autoFocus disabled={!checked}>
            Claim
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default function ComicsClaim(): JSX.Element | null {
  const { address, isConnected } = useAccount();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [availableComics, setAvailableComics] = useState({ p5: 0, p6: 0 });
  const claimCheck = snapshot.find(owner => owner.address === address?.toLowerCase()) || { p5: 0, p6: 0 };

  return (claimCheck.p5 > 0 || claimCheck.p6 > 0) && isConnected ? (
    <>
      <ClaimButton setDialogOpen={setDialogOpen} setAvailableComics={setAvailableComics} />
      <ClaimDialog availableComics={availableComics} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
    </>
  ) : null;
}
