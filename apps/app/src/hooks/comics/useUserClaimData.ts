'use client';

import { useEffect, useState } from 'react';
import { mainnet, sepolia } from 'viem/chains';
import { getAddress, isAddress } from 'ethers6';
import useNetworkContext from '@/hooks/useNetworkContext';
import { COMICS_MERKLE_ROOT } from '@/constants/contracts';

interface UserClaimData {
  index: number;
  amount0: string;
  amount1: string;
  proof: string[];
}

type ClaimPromise = Promise<void | UserClaimData | null>;

const CLAIM_PROMISES: { [key: string]: ClaimPromise } = {};

enum ChainId {
  MAINNET = mainnet.id,
  SEPOLIA = sepolia.id,
}

// returns the claim for the given address, or null if not valid
function fetchClaim(account: string, chainId: ChainId): ClaimPromise {
  if (!isAddress(account)) return Promise.reject(new Error('Invalid address'));
  const key = `${chainId}:${account}`;
  // eslint-disable-next-line no-return-assign
  return (CLAIM_PROMISES[key] =
    CLAIM_PROMISES[key] ??
    fetch(COMICS_MERKLE_ROOT)
      .then(response => response.json())
      .then((data: { claims: { [address: string]: UserClaimData } }) => {
        const claim: UserClaimData | undefined = data.claims[getAddress(account)] ?? undefined;
        if (!claim) return null;
        return {
          index: claim.index,
          amount0: claim.amount0,
          amount1: claim.amount1,
          proof: claim.proof,
        };
      })
      .catch(error => console.error('Failed to get claim data', error)));
}

// parse distributorContract blob and detect if user has claim data
// null means we know it does not
export default function useUserClaimData(): UserClaimData | null | undefined {
  const { address: account, selectedNetworkId } = useNetworkContext();
  const key = `${selectedNetworkId}:${account}`;
  const [claimInfo, setClaimInfo] = useState<{
    [key: string]: UserClaimData | null;
  }>({});

  useEffect(() => {
    if (!account || !selectedNetworkId) return;
    void fetchClaim(account, selectedNetworkId).then(accountClaimInfo =>
      setClaimInfo(prevClaimInfo => ({
        ...prevClaimInfo,
        [key]: accountClaimInfo as UserClaimData,
      })),
    );
  }, [account, selectedNetworkId, key]);

  return account && selectedNetworkId ? claimInfo[key] : undefined;
}
