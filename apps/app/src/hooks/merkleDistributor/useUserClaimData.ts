'use client';

import { useEffect, useMemo, useState } from 'react';
import { mainnet, sepolia } from 'viem/chains';
import { getAddress, isAddress } from 'ethers6';
import useNetworkContext from '@/hooks/useNetworkContext';
import { MERKLE_TREE } from '@/constants/contracts';

interface UserClaimData {
  index: number;
  amount: string;
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
    fetch(MERKLE_TREE)
      .then(response => response.json())
      .then((data: { claims: { [address: string]: UserClaimData } }) => {
        const claim: UserClaimData | undefined = data.claims[getAddress(account)] ?? undefined;
        if (!claim) return null;
        return {
          index: claim.index,
          amount: claim.amount,
          proof: claim.proof,
        };
      })
      .catch(error => {
        console.error('Failed to get claim data', error);
        return null; // Return null in case of an error
      }));
}

// parse distributorContract blob and detect if user has claim data
// null means we know it does not
export default function useUserClaimData(): UserClaimData | null | undefined {
  const { address: account, selectedNetworkId } = useNetworkContext();
  // Use useMemo to compute the key once to avoid recalculating on every render
  const key = useMemo(() => `${selectedNetworkId}:${account}`, [selectedNetworkId, account]);

  const [claimInfo, setClaimInfo] = useState<{
    [key: string]: UserClaimData | null;
  }>({});

  useEffect(() => {
    if (!account || !selectedNetworkId) return;

    // Avoid setting the state unnecessarily if the claim data already exists
    if (claimInfo[key]) return;

    void fetchClaim(account, selectedNetworkId).then(accountClaimInfo => {
      // Only update state if the claim data has changed
      setClaimInfo(prevClaimInfo => {
        if (prevClaimInfo[key] !== accountClaimInfo) {
          return {
            ...prevClaimInfo,
            [key]: accountClaimInfo as UserClaimData,
          };
        }
        return prevClaimInfo;
      });
    });
  }, [account, selectedNetworkId, key, claimInfo]);

  return account && selectedNetworkId ? claimInfo[key] : undefined;
}
