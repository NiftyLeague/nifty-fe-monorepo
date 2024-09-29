'use client';

import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

/*
  ~ What it does? ~

  Gets your ETH balance formatted in ether units

  ~ How can I use? ~

  const {balance, refetch, loading} = useEtherBalance();
*/

type RefetchEthBalance = (options: { throwOnError: boolean; cancelRefetch: boolean }) => Promise<{
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
}>;

interface EtherBalanceState {
  balance: number;
  loading: boolean;
  refetch: RefetchEthBalance;
}

export default function useEtherBalance(): EtherBalanceState {
  const { address, isConnected } = useAccount();
  const { data, isLoading, isFetched, refetch } = useBalance({
    address,
    query: {
      enabled: isConnected,
      staleTime: 10_000,
      select: data => formatUnits(data.value, data.decimals),
    },
  });

  return {
    balance: isFetched ? Number(data) : 0,
    loading: isLoading,
    refetch: refetch as unknown as RefetchEthBalance,
  };
}
