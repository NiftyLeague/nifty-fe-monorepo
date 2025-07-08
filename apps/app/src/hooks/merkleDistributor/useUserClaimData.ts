'use client';

import { useEffect, useMemo, useState } from 'react';
import { mainnet, sepolia } from 'viem/chains';
import { getAddress, isAddress } from 'ethers6';
import { MERKLE_TREE } from '@/constants/contracts';
import useIMXContext from '../useIMXContext';

interface UserClaimData {
  index: number;
  amount: string;
  proof: string[];
}

type ClaimPromise = Promise<UserClaimData | null>;

const CLAIM_PROMISES: { [key: string]: ClaimPromise } = {};

enum ChainId {
  MAINNET = mainnet.id,
  SEPOLIA = sepolia.id,
}

// returns the claim for the given address, or null if not valid
function fetchClaim(account: string, chainId: ChainId): ClaimPromise {
  if (!isAddress(account)) return Promise.reject(new Error('Invalid address'));

  const key = `${chainId}:${account}`;

  // If CLAIM_PROMISES[key] already exists, return it
  if (CLAIM_PROMISES[key]) return CLAIM_PROMISES[key] as ClaimPromise;

  // Create the claim promise and assign it to CLAIM_PROMISES[key]
  const claimPromise = fetch(MERKLE_TREE)
    .then(response => response.json())
    .then((data: { claims: { [address: string]: UserClaimData } }) => {
      const claim: UserClaimData | null = data.claims[getAddress(account)] ?? null;
      if (!claim) return null;
      return { index: claim.index, amount: claim.amount, proof: claim.proof } as UserClaimData;
    })
    .catch(error => {
      console.error('Failed to get claim data', error);
      return null; // Return null in case of an error
    });

  // Store the promise in CLAIM_PROMISES[key]
  CLAIM_PROMISES[key] = claimPromise;
  return claimPromise;
}

// parse distributorContract blob and detect if user has claim data
// null means we know it does not
export default function useUserClaimData(): { claimData: UserClaimData | null; loading: boolean } {
  const [loading, setLoading] = useState(true);
  const { address: account, imxChainId } = useIMXContext();
  // Use useMemo to compute the key once to avoid recalculating on every render
  const key = useMemo(() => `${imxChainId}:${account}`, [imxChainId, account]);

  const [claimInfo, setClaimInfo] = useState<{ [key: string]: UserClaimData | null }>({});

  useEffect(() => {
    if (!account || !imxChainId) return;

    // Avoid setting the state unnecessarily if the claim data already exists
    if (claimInfo[key]) return;

    void fetchClaim(account, imxChainId).then(accountClaimInfo => {
      // Only update state if the claim data has changed
      setClaimInfo(prevClaimInfo => {
        if (prevClaimInfo[key] !== accountClaimInfo) {
          return { ...prevClaimInfo, [key]: accountClaimInfo as UserClaimData };
        }
        return prevClaimInfo;
      });
      setLoading(false);
    });
  }, [account, imxChainId, key, claimInfo]);

  return { claimData: account && imxChainId && claimInfo[key] ? (claimInfo[key] as UserClaimData) : null, loading };
}
