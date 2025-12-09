'use client';

import { useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'ethers';
import type { AddressLike } from 'ethers';
import type { Abi } from 'viem';

import useAuth from '@/hooks/useAuth';
import { TARGET_NETWORK } from '@/constants/networks';
import { getDeployedContract, NFTL_CONTRACT as NFTL_CONTRACT_NAME } from '@/constants/contracts';
import type { UseReadContractParams } from '@/types/web3';

const NFTL_CONTRACT = getDeployedContract(TARGET_NETWORK.chainId, NFTL_CONTRACT_NAME);

type Allowance = { args: [AddressLike, AddressLike]; result: bigint };

type NFTLAllowanceState = { allowance: number; loading: boolean; refetch: () => void };

export default function useNFTLAllowance(contractAddress: `0x${string}`): NFTLAllowanceState {
  const { isLoggedIn } = useAuth();
  const { address, isConnected } = useAccount();

  const { data, isLoading, refetch } = useReadContract<
    UseReadContractParams<Allowance>['abi'],
    UseReadContractParams<Allowance>['functionName'],
    UseReadContractParams<Allowance>['args'],
    UseReadContractParams<Allowance>['config'],
    UseReadContractParams<Allowance>['result']
  >({
    address: NFTL_CONTRACT?.address as `0x${string}`,
    abi: NFTL_CONTRACT?.abi as Abi,
    chainId: TARGET_NETWORK.chainId,
    functionName: 'allowance',
    args: [address, contractAddress],
    query: { staleTime: 10_000, enabled: isLoggedIn && isConnected && contractAddress.length > 0 },
  });

  // Convert the allowance from wei bigint to ether number
  const allowance = useMemo(() => (data ? parseFloat(formatEther(data)) : 0), [data]);

  return { allowance, loading: isLoading, refetch };
}
