'use client';

import { useCallback, useState, useEffect } from 'react';
import { formatEther } from 'ethers6';
import { useReadContract } from 'wagmi';
import { TARGET_NETWORK } from '@/constants/networks';
import { getDeployedContract, NFTL_CONTRACT as NFTL_CONTRACT_NAME } from '@/constants/contracts';

import type { Abi } from 'viem';

const NFTL_CONTRACT = getDeployedContract(TARGET_NETWORK.chainId, NFTL_CONTRACT_NAME);

interface NFTLAllowanceState {
  allowance: number;
  loading: boolean;
  refetch: () => void;
}

export default function useNFTLAllowance(contractAddress: `0x${string}`): NFTLAllowanceState {
  const [allowance, setAllowance] = useState(0);
  const {
    data,
    isLoading: loading,
    refetch: refetchBal,
  } = useReadContract({
    address: NFTL_CONTRACT?.address as `0x${string}`,
    abi: NFTL_CONTRACT?.abi as Abi,
    chainId: TARGET_NETWORK.chainId,
    functionName: 'allowance',
    args: [contractAddress],
    query: {
      staleTime: 10_000,
      enabled: contractAddress.length > 26,
      select: data => parseFloat(formatEther(data as bigint)),
    },
  });

  const updateBal = useCallback(
    (data?: number) => {
      if (data && data !== allowance) setAllowance(data);
    },
    [allowance],
  );

  useEffect(() => {
    updateBal(data);
  }, [data, updateBal]);

  const refetch = useCallback(async () => {
    const { data } = await refetchBal();
    updateBal(data);
  }, [updateBal, refetchBal]);

  return { allowance, loading, refetch };
}
