'use client';

import { useCallback, useState } from 'react';
import { parseEther } from 'ethers6';
import {
  Button,
  CardMedia,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import useNetworkContext from '@/hooks/useNetworkContext';
import useNFTLAllowance from '@/hooks/useNFTLAllowance';
import useTokensBalances from '@/hooks/balances/useTokensBalances';
import { getErrorForName } from '@/utils/name';
import { submitTxWithGasEstimate } from '@/utils/bnc-notify';
import { getDeployedContract, NFTL_CONTRACT, DEGEN_CONTRACT } from '@/constants/contracts';
import { TARGET_NETWORK } from '@/constants/networks';
import { DEBUG } from '@/constants/index';
import type { Degen } from '@/types/degens';
import RenameStepper from './RenameStepper';

const { address: DEGEN_CONTRACT_ADDRESS } = getDeployedContract(TARGET_NETWORK.chainId, DEGEN_CONTRACT) as {
  address: `0x${string}`;
};

interface Props {
  degen?: Degen;
  onSuccess?: () => void;
}

const RenameDegenDialogContent = ({ degen, onSuccess }: Props): React.ReactNode => {
  const { tx, writeContracts } = useNetworkContext();
  const { tokensBalances } = useTokensBalances();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const { allowance, refetch: refetchAllowance } = useNFTLAllowance(DEGEN_CONTRACT_ADDRESS);
  const [isLoadingRename, setLoadingRename] = useState(false);
  const [renameSuccess, setRenameSuccess] = useState(false);
  const insufficientAllowance = allowance < 1000;
  const insufficientBalance = tokensBalances.NFTL.eth < 1000;

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
        refetchAllowance();
      }
      const args = [parseInt(degen?.id || '', 10), input];
      const result = await submitTxWithGasEstimate(tx, degenContract, 'changeName', args);
      if (result) {
        setRenameSuccess(true);
        onSuccess?.();
      }
    }
    setLoadingRename(false);
  }, [
    degen,
    error,
    input,
    insufficientAllowance,
    insufficientBalance,
    onSuccess,
    refetchAllowance,
    tx,
    writeContracts,
  ]);

  return (
    <>
      <DialogTitle sx={{ textAlign: 'center' }} variant="h4">
        Rename DEGEN
      </DialogTitle>
      <DialogContent dividers>
        <Stack rowGap={2}>
          <Stack rowGap={1}>
            <CardMedia
              component="img"
              image={`/img/degens/nfts/${degen?.id}.${degen?.background === 'Legendary' ? 'gif' : 'webp'}`}
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
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h4">Renaming Fee</Typography>
            <Typography>1,000 NFTL</Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          fullWidth
          onClick={handleRename}
          disabled={!input || Boolean(error) || insufficientBalance}
        >
          {!input
            ? 'Please enter a name above!'
            : insufficientBalance
              ? 'You need 1,000 NFTL on Ethereum to rename'
              : insufficientAllowance
                ? 'Approve contract to spend NFTL'
                : 'Rename'}
        </Button>
      </DialogActions>
    </>
  );
};

export default RenameDegenDialogContent;
