'use client';

import {
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button,
} from '@mui/material';
import { useState } from 'react';
import type { Degen } from '@/types/degens';
import { DISABLE_RENT_API_URL } from '@/constants/url';
import { toast } from 'react-toastify';
import DegenImage from '@/components/cards/DegenCard/DegenImage';
import useAuth from '@/hooks/useAuth';

interface Props {
  degen?: Degen;
  isEnabled?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EnableDisableDegenDialogContent = ({ degen, isEnabled = false, onClose, onSuccess }: Props): JSX.Element => {
  const { authToken } = useAuth();
  const [agreement, setAgreement] = useState(false);
  const handleButtonClick = async () => {
    if (!authToken || !degen) {
      return;
    }

    const headers = { authorizationToken: authToken };
    const res = await fetch(`${DISABLE_RENT_API_URL}${isEnabled ? 'deactivate' : 'activate'}?degen_id=${degen.id}`, {
      method: 'POST',
      headers,
    });
    const json = await res.json();
    if (json.statusCode) {
      toast.error(json.body, { theme: 'dark' });
    } else {
      toast.success(`${isEnabled ? 'Disable' : 'Enable'} successfully!`, {
        theme: 'dark',
      });
      onSuccess?.();
      onClose();
    }
  };

  return (
    <>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {isEnabled ? 'Disable' : 'Enable'} Degen #{degen?.id} Rentals
      </DialogTitle>
      <DialogContent dividers sx={{ maxWidth: '320px' }}>
        <Stack rowGap={2}>
          <Stack rowGap={1}>
            {degen?.id && <DegenImage tokenId={degen.id} />}
            <Typography variant="caption" component="p" sx={{ textAlign: 'center' }}>
              Owned by {degen?.owner}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="center" mb={1}>
            {isEnabled ? (
              <Typography align="center">
                Disabling your rental makes your rental queue private. Note that your queue will clear as existing
                rentals reach the already paid-for expiration. Re-enabling fee is 1000 NFTL.
              </Typography>
            ) : (
              <Typography align="center">Enable Rental Fee 1000 NFTL</Typography>
            )}
          </Stack>
          <FormControl>
            <FormControlLabel
              label={<Typography variant="caption">I understand and agree the terms above.</Typography>}
              control={<Checkbox value={agreement} onChange={event => setAgreement(event.target.checked)} />}
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" fullWidth disabled={!agreement} onClick={handleButtonClick}>
          {isEnabled ? 'Disable' : 'Enable'} Degen #{degen?.id} Rentals
        </Button>
      </DialogActions>
    </>
  );
};

export default EnableDisableDegenDialogContent;
