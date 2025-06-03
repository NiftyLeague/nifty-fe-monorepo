'use client';

import { useMemo } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import type { AddressLike, BigNumberish } from 'ethers6';
import type { Comic } from '@/types/marketplace';

import { getDeployedContract, MARKETPLACE_CONTRACT } from '@/constants/contracts';
import { COMICS } from '@/constants/marketplace';
import useAuth from '@/hooks/useAuth';
import useIMXContext from '@/hooks/useIMXContext';
import type { UseReadContractParams } from '@/types/web3';

/*
  ~ What it does? ~

  Gets your Comics NFTs balances from Immutable zkEVM

  ~ How can I use? ~

  const { balances, error, loading, refetch } = useComicsBalances();
*/

const COMICS_IDS = [1, 2, 3, 4, 5, 6];

type ComicsBalancesState = { balances: Comic[]; error: Error | null; loading: boolean; refetch: () => void };

type BalanceOfBatch = { args: [AddressLike[], BigNumberish[]]; result: bigint[] };

export default function useComicsBalances(): ComicsBalancesState {
  const { isLoggedIn } = useAuth();
  const { address, isConnected } = useAccount();
  const { imxChainId } = useIMXContext();

  const marketplaceContract = getDeployedContract(imxChainId, MARKETPLACE_CONTRACT);
  const ownerArr = useMemo(() => Array(COMICS_IDS.length).fill(address) as AddressLike[], [address]);

  const { data, error, isLoading, refetch } = useReadContract<
    UseReadContractParams<BalanceOfBatch>['abi'],
    UseReadContractParams<BalanceOfBatch>['functionName'],
    UseReadContractParams<BalanceOfBatch>['args'],
    UseReadContractParams<BalanceOfBatch>['config'],
    UseReadContractParams<BalanceOfBatch>['result']
  >({
    address: marketplaceContract?.address,
    abi: marketplaceContract?.abi,
    chainId: imxChainId,
    functionName: 'balanceOfBatch',
    args: [ownerArr, COMICS_IDS],
    query: { staleTime: 10_000, enabled: isConnected && isLoggedIn },
  });

  const balances = useMemo(
    () => (data ? data.map((c: bigint, i: number) => ({ ...(COMICS[i] as Comic), balance: Number(c) })) : []),
    [data],
  );

  return { balances, error, loading: isLoading, refetch };
}
