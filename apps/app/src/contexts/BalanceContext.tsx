'use client';

import { type PropsWithChildren, createContext, useEffect, useRef, useMemo } from 'react';

import type { Character } from '@/types/graph';
import useAuth from '@/hooks/useAuth';
import useClaimableNFTL from '@/hooks/useClaimableNFTL';
import useNFTLBalance from '@/hooks/useNFTLBalance';
import { useOwnerSearch } from '@/hooks/useGraphQL';
import useArcadeBalance from '@/hooks/useArcadeBalance';

interface BalanceContext {
  arcadeBalance: number;
  characterCount: number;
  characters: Character[];
  isDegenOwner: boolean;
  loadingArcadeBal: boolean;
  loadingDegens: boolean;
  loadingNFTLAccrued: boolean;
  loadingNFTLBal: boolean;
  refetchArcadeBal: () => void;
  refreshClaimableNFTL: () => void;
  refreshDegenBalance: () => void;
  refreshNFTLBalance: () => void;
  tokenIndices: number[];
  totalAccrued: number;
  userNFTLBalance: number;
}

const CONTEXT_INITIAL_STATE: BalanceContext = {
  arcadeBalance: 0,
  characterCount: 0,
  characters: [],
  isDegenOwner: false,
  loadingArcadeBal: false,
  loadingDegens: false,
  loadingNFTLAccrued: false,
  loadingNFTLBal: false,
  refetchArcadeBal: () => {},
  refreshClaimableNFTL: () => {},
  refreshDegenBalance: () => {},
  refreshNFTLBalance: () => {},
  tokenIndices: [],
  totalAccrued: 0,
  userNFTLBalance: 0,
};

const BalanceContext = createContext<BalanceContext>(CONTEXT_INITIAL_STATE);

export const BalanceProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const firstRenderRef = useRef(true);
  const { isLoggedIn } = useAuth();
  const { isFetching, data: owner, refetch: refreshDegenBalance } = useOwnerSearch();
  const { characterCount = 0 } = owner || {};
  const isDegenOwner = characterCount > 0;

  const characters = useMemo(() => {
    const characterList = owner?.characters ? [...owner.characters] : [];
    return characterList.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  }, [owner]);

  const tokenIndices = useMemo(() => characters.map(char => parseInt(char.id, 10)), [characters]);
  const { totalAccrued, loading: claimLoading, refetch: refreshClaimableNFTL } = useClaimableNFTL(tokenIndices);

  const { balance: userNFTLBalance, loading: nftlLoading, refetch: refreshNFTLBalance } = useNFTLBalance();

  const { arcadeBalance, loading: arcadeLoading, refetch: refetchArcadeBal } = useArcadeBalance();

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (!isLoggedIn) return;
    refreshDegenBalance();
    refreshClaimableNFTL();
    refreshNFTLBalance();
    refetchArcadeBal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <BalanceContext.Provider
      value={{
        arcadeBalance,
        characterCount,
        characters,
        isDegenOwner,
        loadingArcadeBal: arcadeLoading,
        loadingDegens: isFetching,
        loadingNFTLAccrued: isFetching || claimLoading,
        loadingNFTLBal: nftlLoading,
        refetchArcadeBal,
        refreshClaimableNFTL,
        refreshDegenBalance,
        refreshNFTLBalance,
        tokenIndices,
        totalAccrued,
        userNFTLBalance,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export default BalanceContext;
