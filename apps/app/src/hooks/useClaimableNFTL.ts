'use client';

import { useMemo } from 'react';
import { formatEther } from 'ethers6';
import { useReadContract } from 'wagmi';
import type { Abi } from 'viem';
import { TARGET_NETWORK } from '@/constants/networks';
import { getDeployedContract, NFTL_CONTRACT as NFTL_CONTRACT_NAME } from '@/constants/contracts';
import useAuth from '@/hooks/useAuth';

/*
  ~ What it does? ~

  Gets unlclaimed NFTL balance for a provided list of DEGEN token indices

  ~ How can I use? ~

  const { totalAccrued, error, loading, refetch } = useClaimableNFTL([1, 2, 3, 4, 5]);
*/

const NFTL_CONTRACT = getDeployedContract(TARGET_NETWORK.chainId, NFTL_CONTRACT_NAME);

interface NFTLClaimableState {
  totalAccrued: number;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}

export default function useClaimableNFTL(tokenIndices: number[]): NFTLClaimableState {
  const { isLoggedIn } = useAuth();
  const { data, error, isLoading, refetch } = useReadContract({
    address: NFTL_CONTRACT?.address as `0x${string}`,
    abi: NFTL_CONTRACT?.abi as Abi,
    functionName: 'accumulatedMultiCheck',
    args: [tokenIndices],
    query: {
      staleTime: 10_000,
      enabled: tokenIndices.length > 0 && isLoggedIn,
      select: data => parseFloat(formatEther(data as bigint)),
    },
  });

  const totalAccrued = useMemo(() => data ?? 0, [data]);

  return { totalAccrued, error, loading: isLoading, refetch };
}
