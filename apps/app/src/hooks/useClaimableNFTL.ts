'use client';

import { useCallback, useState, useEffect } from 'react';
import { formatEther, type InterfaceAbi } from 'ethers6';
import { useReadContract } from 'wagmi';
import type { Abi } from 'viem';
import { TARGET_NETWORK } from '@/constants/networks';
import CONTRACTS from '@/constants/contracts/deployments';
import useAuth from '@/hooks/useAuth';

const NFTL_CONTRACT = CONTRACTS[TARGET_NETWORK.chainId]?.NFTLToken as {
  address: `0x${string}`;
  abi: InterfaceAbi;
};

interface NFTLClaimableState {
  totalAccrued: number;
  loading: boolean;
  refetch: () => void;
}

export default function useClaimableNFTL(tokenIndices: number[]): NFTLClaimableState {
  const { isLoggedIn } = useAuth();
  const [totalAccrued, setTotalAccrued] = useState(0);
  const {
    data,
    isLoading: loading,
    refetch: refetchBal,
  } = useReadContract({
    address: NFTL_CONTRACT.address,
    abi: NFTL_CONTRACT.abi as Abi,
    functionName: 'accumulatedMultiCheck',
    args: [tokenIndices],
    query: {
      staleTime: 10_000,
      enabled: tokenIndices.length > 0 && isLoggedIn,
      select: data => parseFloat(formatEther(data as bigint)),
    },
  });

  const updateBal = useCallback(
    (data?: number) => {
      if (data != undefined && data !== totalAccrued) setTotalAccrued(data);
    },
    [totalAccrued],
  );

  useEffect(() => {
    updateBal(data);
  }, [data, updateBal]);

  const refetch = useCallback(async () => {
    const { data } = await refetchBal();
    updateBal(data);
  }, [updateBal, refetchBal]);

  return { totalAccrued, loading, refetch };
}
