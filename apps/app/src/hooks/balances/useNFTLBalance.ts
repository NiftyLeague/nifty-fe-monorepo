'use client';

import { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { getContractAddress, NFTL_CONTRACT, NFTL_IMX_CONTRACT } from '@/constants/contracts';
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
  const { data, isLoading, refetch, error } = useBalance({
    address,
    chainId: TARGET_NETWORK.chainId,
    token: getContractAddress(TARGET_NETWORK.chainId, NFTL_CONTRACT),
    query: {
      staleTime: 10_000,
      enabled: isConnected && isLoggedIn,
      select: data => formatUnits(data.value, data.decimals),
    },
  });

  const balance = useMemo(() => (data !== undefined ? Number(data) : 0), [data]);

  return { balance, error, loading: isLoading, refetch };
}

/** Fetch users NFTL balance on Immutable zkEVM */
export function useImmutableNFTLBalance(): NFTLBalanceState {
  const { isLoggedIn } = useAuth();
  const { address, isConnected } = useAccount();
  const { imxChainId } = useIMXContext();
  const { data, isLoading, refetch, error } = useBalance({
    address,
    chainId: imxChainId,
    token: getContractAddress(imxChainId, NFTL_IMX_CONTRACT),
    query: {
      staleTime: 10_000,
      enabled: isConnected && isLoggedIn,
      select: data => formatUnits(data.value, data.decimals),
    },
  });

  const balance = useMemo(() => (data !== undefined ? Number(data) : 0), [data]);

  return { balance, error, loading: isLoading, refetch };
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
