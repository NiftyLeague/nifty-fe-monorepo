'use client';

import { Skeleton, Stack, Typography } from '@mui/material';

import { formatNumberToDisplay } from '@/utils/numbers';
import useTokensBalances from '@/hooks/balances/useTokensBalances';
import SectionTitle from '@/components/sections/SectionTitle';

const TitleSection = (): JSX.Element => {
  const { loadingNFTLBal, userNFTLBalance } = useTokensBalances();
  return (
    <SectionTitle
      firstSection
      variant="h3"
      actions={
        <Stack direction="row" gap={2}>
          {loadingNFTLBal ? (
            <Skeleton variant="rectangular" animation="wave" width={120} height={40} />
          ) : (
            <Typography variant="body1" fontWeight="bold">
              NFTL in Wallet: {formatNumberToDisplay(userNFTLBalance)}
            </Typography>
          )}
        </Stack>
      }
    >
      My Tokens
    </SectionTitle>
  );
};

export default TitleSection;
