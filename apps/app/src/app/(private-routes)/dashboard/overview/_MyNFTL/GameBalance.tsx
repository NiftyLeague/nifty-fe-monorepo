'use client';

import Image from 'next/image';
import { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@nl/theme';

import { formatNumberToDisplay } from '@/utils/numbers';
import useUserUnclaimedAmount from '@/hooks/merkleDistributor/useUserUnclaimedAmount';
import WithdrawButtonDialog from '@/components/dialog/WithdrawButtonDialog';
import HoverDataCard from '@/components/cards/HoverDataCard';

const GameBalance: React.FC = memo(() => {
  const theme = useTheme();
  const { nftlUnclaimed, loading } = useUserUnclaimedAmount();

  return (
    <HoverDataCard
      title="Game Balance"
      primary={`${formatNumberToDisplay(nftlUnclaimed)} NFTL`}
      isLoading={loading}
      customStyle={{
        backgroundColor: 'var(--color-background-3)',
        border: 'var(--border-default)',
        position: 'relative',
      }}
      secondary="Available to Withdraw"
      actions={
        <>
          <IconButton disabled color="primary" component="span" sx={{ position: 'absolute', top: -2, right: -2 }}>
            <Image src="/img/logos/passport/32px.svg" alt="Immutable" width={22} height={22} />
          </IconButton>
          <WithdrawButtonDialog balance={nftlUnclaimed} loading={loading} />
        </>
      }
    />
  );
});

GameBalance.displayName = 'GameBalance';

export default GameBalance;
