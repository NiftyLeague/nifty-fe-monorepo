'use client';

import { useCallback, useEffect, useState } from 'react';
import { formatEther } from 'ethers6';
import { Grid } from '@mui/material';
import { useTheme, sectionSpacing } from '@nl/theme';
import HoverDataCard from '@/components/cards/HoverDataCard';
import { formatNumberToDisplay } from '@/utils/numbers';
import useBalances from '@/hooks/useBalances';
import useNetworkContext from '@/hooks/useNetworkContext';
import useContractReader from '@/hooks/useContractReader';
import { NFTL_RAFFLE_CONTRACT } from '@/constants/contracts';

function useDepositBalance(refreshKey = 0): number {
  const { address, readContracts } = useNetworkContext();
  const [balance, setBalance] = useState<bigint>(0n);
  const result = useContractReader(
    readContracts,
    NFTL_RAFFLE_CONTRACT,
    'userDeposits',
    [address],
    undefined,
    undefined,
    refreshKey,
    !address,
  ) as bigint;
  useEffect(() => {
    if (result && result !== balance) setBalance(result);
  }, [result, balance]);
  return parseFloat(formatEther(balance));
}

function useTicketBalance(): {
  ticketCount: number;
  refetchBalance: () => void;
} {
  const [refreshKey, setRefreshKey] = useState(0);
  const userDeposits = useDepositBalance(refreshKey);
  const refetchBalance = useCallback(() => setRefreshKey(Math.random), []);
  return {
    ticketCount: Math.floor(userDeposits && userDeposits >= 1000 ? userDeposits / 1000 : 0),
    refetchBalance,
  };
}

const Raffle = (): JSX.Element => {
  const theme = useTheme();
  const { loadingNFTLBal } = useBalances();
  const { ticketCount } = useTicketBalance();
  const [mockTickets, setMockTickets] = useState(0);
  useEffect(() => setMockTickets(ticketCount), [ticketCount]);

  return (
    <Grid container spacing={sectionSpacing}>
      <Grid item xs={12}>
        <HoverDataCard
          title="Ticket Balance"
          primary={`${formatNumberToDisplay(mockTickets, 0)} Tickets`}
          customStyle={{
            backgroundColor: theme.palette.background.default,
            border: '1px solid',
            borderColor: theme.palette.border,
          }}
          isLoading={loadingNFTLBal}
        />
      </Grid>
    </Grid>
  );
};

export default Raffle;
