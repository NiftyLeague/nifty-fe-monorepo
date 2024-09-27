'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import { useTheme } from '@nl/theme';
import Image from 'next/image';

import { NFTL_CONTRACT } from '@/constants/contracts';
import { DEBUG } from '@/constants/index';
import { formatNumberToDisplay } from '@/utils/numbers';
import useBalances from '@/hooks/useBalances';
import useNetworkContext from '@/hooks/useNetworkContext';
import HoverDataCard from '@/components/cards/HoverDataCard';

const DegenBalance = (): JSX.Element => {
  const theme = useTheme();
  const { writeContracts, tx } = useNetworkContext();
  const { loadingNFTLAccrued, refreshClaimableNFTL, tokenIndices, totalAccrued } = useBalances();
  const [mockAccrued, setMockAccrued] = useState(0);

  useEffect(() => {
    if (totalAccrued) setMockAccrued(totalAccrued);
  }, [totalAccrued]);

  const handleClaimNFTL = useCallback(async () => {
    // eslint-disable-next-line no-console
    if (DEBUG) console.log('claim', tokenIndices, totalAccrued);
    const nftl = writeContracts[NFTL_CONTRACT];
    const res = await tx(nftl.claim(tokenIndices));
    if (res) {
      setMockAccrued(0);
      setTimeout(refreshClaimableNFTL, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIndices, totalAccrued, tx, writeContracts]);

  return (
    <HoverDataCard
      title="DEGEN Balance"
      primary={`${mockAccrued ? formatNumberToDisplay(mockAccrued) : '0.00'} NFTL`}
      customStyle={{
        backgroundColor: theme.palette.background.default,
        border: '1px solid',
        borderColor: theme.palette.border,
        position: 'relative',
      }}
      secondary="Available to Claim"
      isLoading={loadingNFTLAccrued}
      actions={
        <>
          <IconButton disabled color="primary" component="span" sx={{ position: 'absolute', top: -2, right: -2 }}>
            <Image src="/icons/eth.svg" alt="Ethereum" width={22} height={22} />
          </IconButton>
          <Button
            fullWidth
            variant="contained"
            disabled={!(mockAccrued > 0.0 && writeContracts[NFTL_CONTRACT])}
            onClick={handleClaimNFTL}
          >
            Claim NFTL
          </Button>
        </>
      }
    />
  );
};

export default DegenBalance;
