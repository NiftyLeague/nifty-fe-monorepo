'use client';

import { useMemo } from 'react';
import { useAccount, useReadContract, type Config } from 'wagmi';
import type { Abi } from 'viem';
import type { AddressLike, BigNumberish } from 'ethers6';
import type { Item } from '@/types/marketplace';

import { getDeployedContract, MARKETPLACE_CONTRACT } from '@/constants/contracts';
import { ITEMS } from '@/constants/marketplace';
import useAuth from '@/hooks/useAuth';
import useIMXContext from '@/hooks/useIMXContext';

/*
  ~ What it does? ~

  Gets your Items NFTs balances from Immutable zkEVM

  ~ How can I use? ~

  const { balances, error, loading, refetch } = useItemsBalance();
*/

const ITEM_IDS = [101, 102, 103, 104, 105, 106, 107];

type ItemsBalancesState = {
  balances: Item[];
  error: Error | null;
  loading: boolean;
  refetch: () => void;
};

type BalanceOfBatch = {
  args: [AddressLike[], BigNumberish[]];
  result: bigint[];
};

type UseReadContractParams = {
  abi: Abi;
  functionName: 'balanceOfBatch';
  args: BalanceOfBatch['args'];
  config: Config;
  result: BalanceOfBatch['result'];
};

export default function useItemssBalances(): ItemsBalancesState {
  const { isLoggedIn } = useAuth();
  const { address, isConnected } = useAccount();
  const { imxChainId } = useIMXContext();

  const marketplaceContract = getDeployedContract(imxChainId, MARKETPLACE_CONTRACT);
  const ownerArr = useMemo(() => Array(ITEM_IDS.length).fill(address) as AddressLike[], [address]);

  const { data, error, isLoading, refetch } = useReadContract<
    UseReadContractParams['abi'],
    UseReadContractParams['functionName'],
    UseReadContractParams['args'],
    UseReadContractParams['config'],
    UseReadContractParams['result']
  >({
    address: marketplaceContract?.address,
    abi: marketplaceContract?.abi,
    chainId: imxChainId,
    functionName: 'balanceOfBatch',
    args: [ownerArr, ITEM_IDS],
    query: {
      staleTime: 10_000,
      enabled: isConnected && isLoggedIn,
    },
  });

  const balances = useMemo(
    () => (data ? data.map((c: bigint, i: number) => ({ ...(ITEMS[i] as Item), balance: Number(c) })) : []),
    [data],
  );

  return { balances, error, loading: isLoading, refetch };
}