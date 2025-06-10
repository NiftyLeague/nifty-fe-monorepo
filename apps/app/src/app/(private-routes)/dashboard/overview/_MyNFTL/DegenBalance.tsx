'use client';

import Image from 'next/image';
import { Button, IconButton } from '@mui/material';
import { useTheme } from '@nl/theme';

import { formatNumberToDisplay } from '@/utils/numbers';
import HoverDataCard from '@/components/cards/HoverDataCard';
import useClaimNFTL from '@/hooks/writeContracts/useClaimNFTL';
import useNetworkContext from '@/hooks/useNetworkContext';

const DegenBalance = (): React.ReactNode => {
  const theme = useTheme();
  const { isConnected } = useNetworkContext();
  const { balance, claimCallback, loading } = useClaimNFTL();

  return (
    <HoverDataCard
      title="DEGEN Balance"
      primary={`${balance ? formatNumberToDisplay(balance) : '0.00'} NFTL`}
      customStyle={{
        backgroundColor: theme.palette.background.default,
        border: 'var(--border-light)',
        position: 'relative',
      }}
      secondary="Available to Claim"
      isLoading={loading}
      actions={
        <>
          <IconButton disabled color="primary" component="span" sx={{ position: 'absolute', top: -2, right: -2 }}>
            <Image src="/icons/eth.svg" alt="Ethereum" width={22} height={22} />
          </IconButton>
          <Button fullWidth variant="contained" disabled={!(balance > 0.0 && isConnected)} onClick={claimCallback}>
            Claim NFTL
          </Button>
        </>
      }
    />
  );
};

export default DegenBalance;
