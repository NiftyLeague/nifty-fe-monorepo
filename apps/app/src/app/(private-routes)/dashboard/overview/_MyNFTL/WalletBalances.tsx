'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button, Grid2, IconButton, Stack } from '@mui/material';
import { useTheme } from '@nl/theme';

import { formatNumberToDisplay } from '@/utils/numbers';
import useTokensBalances from '@/hooks/balances/useTokensBalances';
import BridgeButtonDialog from '@/components/dialog/BridgeButtonDialog';
import HoverDataCard from '@/components/cards/HoverDataCard';
import { GOVERNANCE_PORTAL_URL, SNAPSHOT_PORTAL_URL } from '@/constants/url';

const WalletBalances = (): JSX.Element => {
  const theme = useTheme();
  const { loadingNFTLBal, tokensBalances } = useTokensBalances();

  return (
    <>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <HoverDataCard
          title="IMX Wallet"
          primary={`${formatNumberToDisplay(tokensBalances.NFTL.imx)} NFTL`}
          isLoading={loadingNFTLBal}
          customStyle={{
            backgroundColor: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.border,
            position: 'relative',
          }}
          secondary="Available to Use"
          actions={
            <>
              <IconButton disabled color="primary" component="span" sx={{ position: 'absolute', top: -2, right: -2 }}>
                <Image src="/img/logos/passport/32px.svg" alt="Immutable" width={22} height={22} />
              </IconButton>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: '100%' }}>
                <Link href={SNAPSHOT_PORTAL_URL} target="_blank" rel="noreferrer" style={{ width: '48%' }}>
                  <Button fullWidth variant="outlined">
                    Snapshot
                  </Button>
                </Link>
                <Link href={GOVERNANCE_PORTAL_URL} target="_blank" rel="noreferrer" style={{ width: '48%' }}>
                  <Button fullWidth variant="contained">
                    Tally
                  </Button>
                </Link>
              </Stack>
            </>
          }
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6 }}>
        <HoverDataCard
          title="ETH Wallet"
          primary={`${formatNumberToDisplay(tokensBalances.NFTL.eth)} NFTL`}
          customStyle={{
            backgroundColor: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.border,
            position: 'relative',
          }}
          secondary="Available to Bridge"
          isLoading={loadingNFTLBal}
          actions={
            <>
              <IconButton disabled color="primary" component="span" sx={{ position: 'absolute', top: -2, right: -2 }}>
                <Image src="/icons/eth.svg" alt="Ethereum" width={22} height={22} />
              </IconButton>
              <BridgeButtonDialog balance={tokensBalances.NFTL.eth} loading={loadingNFTLBal} />
            </>
          }
        />
      </Grid2>
    </>
  );
};

WalletBalances.displayName = 'WalletBalances';

export default WalletBalances;
