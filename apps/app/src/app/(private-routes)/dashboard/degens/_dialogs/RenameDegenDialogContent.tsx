'use client';

import { useCallback, useEffect, useState } from 'react';
import { parseEther, type AddressLike } from 'ethers6';
import {
  DialogTitle,
  DialogContent,
  Stack,
  CardMedia,
  Typography,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

import useNetworkContext from '@/hooks/useNetworkContext';
import useBalances from '@/hooks/useBalances';
import { getErrorForName } from '@/utils/name';
import { submitTxWithGasEstimate } from '@/utils/bnc-notify';
import { NFTL_CONTRACT, DEGEN_CONTRACT } from '@/constants/contracts';
import { DEGEN_BASE_IMAGE_URL } from '@/constants/url';
import { TARGET_NETWORK } from '@/constants/networks';
import { DEBUG } from '@/constants/index';
import type { Degen } from '@/types/degens';
import RenameStepper from './RenameStepper';

interface Props {
  degen?: Degen;
  onSuccess?: () => void;
}

const RenameDegenDialogContent = ({ degen, onSuccess }: Props): JSX.Element => {
  const { address, tx, writeContracts } = useNetworkContext();
  const { userNFTLBalance } = useBalances();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [isLoadingRename, setLoadingRename] = useState(false);
  const [renameSuccess, setRenameSuccess] = useState(false);
  const insufficientAllowance = allowance < 1000n;
  const insufficientBalance = userNFTLBalance < 1000;

  useEffect(() => {
    const getAllowance = async () => {
      const degenContract = writeContracts[DEGEN_CONTRACT];
      const nftl = writeContracts[NFTL_CONTRACT];
      if (degenContract && nftl) {
        const DEGENAddress = await degenContract.getAddress();
        const allowanceBN = (await nftl.allowance(address as AddressLike, DEGENAddress)) as bigint;
        setAllowance(allowanceBN);
      }
    };
    setRenameSuccess(false);
    if (writeContracts && writeContracts[NFTL_CONTRACT] && writeContracts[DEGEN_CONTRACT])
      // eslint-disable-next-line no-void
      void getAllowance();
  }, [address, writeContracts]);

  const validateName = (value: string) => {
    setInput(value);
    const errorMsg = getErrorForName(value);
    setError(errorMsg);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    validateName(value);
  };

  const handleRename = useCallback(async () => {
    setLoadingRename(true);
    if (insufficientBalance) {
      setError('Failed to charge the rental rename fee');
    } else if (!error && writeContracts && writeContracts[DEGEN_CONTRACT] && writeContracts[NFTL_CONTRACT]) {
      // eslint-disable-next-line no-console
      if (DEBUG) console.log('Rename NFT to:', input);
      const degenContract = writeContracts[DEGEN_CONTRACT];
      const nftl = writeContracts[NFTL_CONTRACT];
      if (insufficientAllowance) {
        // eslint-disable-next-line no-console
        if (DEBUG) console.log('Current allowance too low');
        const DEGENAddress = await degenContract.getAddress();
        await tx(nftl.increaseAllowance(DEGENAddress, parseEther('100000')));
        setAllowance(1000n);
      }
      const args = [parseInt(degen?.id || '', 10), input];
      const result = await submitTxWithGasEstimate(tx, degenContract, 'changeName', args);
      if (result) {
        setRenameSuccess(true);
        onSuccess?.();
      }
    }
    setLoadingRename(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, onSuccess, input, insufficientAllowance, degen, tx, writeContracts]);

  return (
    <>
      <DialogTitle sx={{ textAlign: 'center' }}>Rename DEGEN</DialogTitle>
      <DialogContent dividers sx={{ maxWidth: '820px' }}>
        <Stack rowGap={2}>
          <Stack rowGap={1}>
            <CardMedia
              component="img"
              image={`${DEGEN_BASE_IMAGE_URL}/${TARGET_NETWORK.name}/images/${degen?.id}.${
                degen?.background === 'Legendary' ? 'mp4' : 'png'
              }`}
              alt="degen"
              sx={{ aspectRatio: '1/1', width: '240px', margin: '0 auto' }}
            />
            <Typography variant="caption" component="p" sx={{ textAlign: 'center' }}>
              Owned by {degen?.owner}
            </Typography>
          </Stack>
          <TextField
            label="Enter new degen name"
            name="new-degen-name"
            variant="outlined"
            size="small"
            fullWidth
            value={input}
            error={!!error}
            helperText={error}
            disabled={isLoadingRename}
            onChange={handleChange}
          />
          <RenameStepper
            insufficientAllowance={insufficientAllowance}
            renameSuccess={renameSuccess}
            insufficientBalance={insufficientBalance}
          />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">Renaming Fee</Typography>
            <Typography>1,000 NFTL</Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" fullWidth onClick={handleRename} disabled={!input || Boolean(error)}>
          Rename
        </Button>
      </DialogActions>
    </>
  );
};

export default RenameDegenDialogContent;
