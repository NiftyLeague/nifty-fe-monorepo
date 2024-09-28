'use client';

import { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { getContractAddress, NFTL_CONTRACT } from '@/constants/contracts';
import { TARGET_NETWORK } from '@/constants/networks';
import useAuth from '@/hooks/useAuth';

/*
  ~ What it does? ~

  Gets your balance in NFTL from given address via user provider

  ~ How can I use? ~

  const { balance, error, loading, refetch } = useNFTLBalance();
*/

interface NFTLBalanceState {
  balance: number;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}

export default function useNFTLBalance(): NFTLBalanceState {
  const { isLoggedIn } = useAuth();
  const { address, isConnected } = useAccount();
  const { data, isLoading, refetch, error } = useBalance({
    address,
    token: getContractAddress(TARGET_NETWORK.chainId, NFTL_CONTRACT),
    query: {
      staleTime: 10_000,
      enabled: isConnected && isLoggedIn,
      select: data => formatUnits(data.value, data.decimals),
    },
  });

  const balance = useMemo(() => Number(data) ?? 0, [data]);

  return { balance, error, loading: isLoading, refetch };
}
