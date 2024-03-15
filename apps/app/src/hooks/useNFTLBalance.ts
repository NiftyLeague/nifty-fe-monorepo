'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { NFTL_TOKEN_ADDRESS } from '@/constants/contracts';
import { TARGET_NETWORK } from '@/constants/networks';
import useAuth from '@/hooks/useAuth';

/*
  ~ What it does? ~

  Gets your balance in NFTL from given address via user provider

  ~ How can I use? ~

  const { balance, loading, refetch } = useNFTLBalance();
*/

interface NFTLBalanceState {
  balance: number;
  loading: boolean;
  refetch: () => void;
}

export default function useNFTLBalance(): NFTLBalanceState {
  const { address, isConnected } = useAccount();
  const { isLoggedIn } = useAuth();
  const [balance, setBalance] = useState(0);
  const {
    data,
    isLoading: loading,
    refetch: refetchBal,
  } = useBalance({
    address,
    token: NFTL_TOKEN_ADDRESS[TARGET_NETWORK.chainId],
    query: {
      staleTime: 10_000,
      enabled: isConnected && isLoggedIn,
      select: data => formatUnits(data.value, data.decimals),
    },
  });

  const updateBal = useCallback(
    (formatted?: string) => {
      if (formatted && Number(formatted) !== balance) setBalance(Number(formatted));
    },
    [balance],
  );

  useEffect(() => {
    updateBal(data);
  }, [data, updateBal]);

  const refetch = useCallback(async () => {
    const { data } = await refetchBal();
    updateBal(data);
  }, [updateBal, refetchBal]);

  return { balance, loading, refetch };
}
