'use client';

import { useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { getContractAddress, NFTL_CONTRACT, NFTL_IMX_CONTRACT, getContractABI } from '@/constants/contracts';
import { TARGET_NETWORK } from '@/constants/networks';
import useAuth from '@/hooks/useAuth';
import useIMXContext from '@/hooks/useIMXContext';

/*
  ~ What it does? ~

  Gets NFTL wallet balances for user address via user provider.

  ~ How can I use? ~

  For Ethereum balance only:
  const { balance, error, loading, refetch } = useEthereumNFTLBalance();

  For Immutable balance only:
  const { balance, error, loading, refetch } = useImmutableNFTLBalance();

  For both Ethereum and Immutable balances:
  const { balances, error, loading, refetch } = useNFTLBalance();
*/

interface NFTLBalanceState {
  balance: number;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}

/** Fetch users NFTL balance on Ethereum */
export function useEthereumNFTLBalance(): NFTLBalanceState {
  const { isLoggedIn } = useAuth();
  const { address, isConnected } = useAccount();
  const tokenAddress = getContractAddress(TARGET_NETWORK.chainId, NFTL_CONTRACT);

  const {
    data: balanceData,
    isLoading,
    refetch,
    error,
  } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: getContractABI(TARGET_NETWORK.chainId, NFTL_CONTRACT),
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: TARGET_NETWORK.chainId,
    query: { staleTime: 10_000, enabled: isConnected && isLoggedIn && !!address },
  });

  const balance = useMemo(() => {
    if (balanceData !== undefined) {
      return Number(formatUnits(balanceData as bigint, 18));
    }
    return 0;
  }, [balanceData]);

  return { balance, error: error as Error | null, loading: isLoading, refetch };
}

/** Fetch users NFTL balance on Immutable zkEVM */
export function useImmutableNFTLBalance(): NFTLBalanceState {
  const { isLoggedIn } = useAuth();
  const { address, isConnected } = useAccount();
  const { imxChainId } = useIMXContext();
  const tokenAddress = getContractAddress(imxChainId, NFTL_IMX_CONTRACT);

  const {
    data: balanceData,
    isLoading,
    refetch,
    error,
  } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: getContractABI(imxChainId, NFTL_IMX_CONTRACT),
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: imxChainId,
    query: { staleTime: 10_000, enabled: isConnected && isLoggedIn && !!address },
  });

  const balance = useMemo(() => {
    if (balanceData !== undefined) {
      return Number(formatUnits(balanceData as bigint, 18));
    }
    return 0;
  }, [balanceData]);

  return { balance, error: error as Error | null, loading: isLoading, refetch };
}

interface NFTLBalancesState {
  balances: { eth: number; imx: number };
  error: Error | null;
  loading: boolean;
  refetch: () => void;
}
/** Fetch users NFTL balance on both Ethereum & Immutable zkEVM */
export default function useNFTLBalance(): NFTLBalancesState {
  const { balance: ethBal, loading: ethLoading, refetch: ethRefetch, error: ethError } = useEthereumNFTLBalance();
  const { balance: imxBal, loading: imxLoading, refetch: imxRefetch, error: imxError } = useImmutableNFTLBalance();

  const balances = useMemo(() => ({ eth: ethBal, imx: imxBal }), [ethBal, imxBal]);

  return {
    balances,
    error: ethError ?? imxError,
    loading: ethLoading || imxLoading,
    refetch: () => {
      ethRefetch();
      imxRefetch();
    },
  };
}
