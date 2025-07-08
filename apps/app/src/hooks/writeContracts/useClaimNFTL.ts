'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TransactionResponse } from 'ethers6';
import type { MetamaskError } from '@/types/notify';
import { handleError } from '@/utils/bnc-notify';

import { NFTL_CONTRACT } from '@/constants/contracts';
import { DEBUG } from '@/constants/index';
import useNetworkContext from '@/hooks/useNetworkContext';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import useTokensBalances from '@/hooks/balances/useTokensBalances';

export default function useClaimNFTL(): {
  balance: number;
  claimCallback: () => Promise<TransactionResponse | null>;
  loading: boolean;
} {
  const { writeContracts, tx } = useNetworkContext();
  const { degenTokenIndices } = useNFTsBalances();
  const { loadingNFTLAccrued, refreshClaimableNFTL, totalAccruedNFTL } = useTokensBalances();

  const [mockAccrued, setMockAccrued] = useState(totalAccruedNFTL);
  const [loading, setLoading] = useState(loadingNFTLAccrued);

  useEffect(() => {
    if (totalAccruedNFTL) setMockAccrued(totalAccruedNFTL);
  }, [totalAccruedNFTL]);

  useEffect(() => {
    setLoading(loadingNFTLAccrued);
  }, [loadingNFTLAccrued]);

  const verifyDegensWithClaimableNFTL = useCallback(async () => {
    const nftl = writeContracts[NFTL_CONTRACT];
    const degensWithClaimableNFTL = await Promise.all(
      degenTokenIndices.map(async degen => {
        const claimable = await nftl.accumulated(degen);
        return claimable > 0n ? degen : null;
      }),
    );
    return degensWithClaimableNFTL.filter(Boolean);
  }, [degenTokenIndices, writeContracts]);

  const handleClaimNFTL = useCallback(async () => {
    const degensWithClaimableNFTL = await verifyDegensWithClaimableNFTL();
    // eslint-disable-next-line no-console
    if (DEBUG) console.log('claim', degensWithClaimableNFTL, totalAccruedNFTL);
    const nftl = writeContracts[NFTL_CONTRACT];
    const txRes = await tx(nftl.claim(degenTokenIndices));
    if (txRes) {
      setMockAccrued(0);
      setTimeout(refreshClaimableNFTL, 5000);
    }
    return txRes;
  }, [degenTokenIndices, refreshClaimableNFTL, totalAccruedNFTL, tx, verifyDegensWithClaimableNFTL, writeContracts]);

  const claimCallback = useCallback(async () => {
    setLoading(true);
    try {
      const res = await handleClaimNFTL();
      setLoading(false);
      return res;
    } catch (error) {
      handleError(error as MetamaskError);
      setLoading(false);
      return null;
    }
  }, [handleClaimNFTL]);

  return { balance: mockAccrued, claimCallback, loading };
}
