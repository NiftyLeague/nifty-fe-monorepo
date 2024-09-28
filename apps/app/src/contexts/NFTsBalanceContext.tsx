'use client';

import { createContext, useEffect, useRef, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import type { Character } from '@/types/graph';
import type { Comic, Item } from '@/types/marketplace';

import { useOwnerSearch } from '@/hooks/useGraphQL';
import useAuth from '@/hooks/useAuth';
import useComicsBalance from '@/hooks/balances/useComicsBalance';
import useIMXContext from '@/hooks/useIMXContext';
import useItemsBalance from '@/hooks/balances/useItemsBalance';

interface NFTsBalanceContext {
  comicsBalance: Comic[];
  degenCount: number;
  degensBalance: Character[];
  degenTokenIndices: number[];
  isDegenOwner: boolean;
  itemsBalance: Item[];
  loadingComics: boolean;
  loadingDegens: boolean;
  loadingItems: boolean;
  refreshDegenBalance: () => void;
}

const CONTEXT_INITIAL_STATE: NFTsBalanceContext = {
  comicsBalance: [],
  degenCount: 0,
  degensBalance: [],
  degenTokenIndices: [],
  isDegenOwner: false,
  itemsBalance: [],
  loadingComics: true,
  loadingDegens: false,
  loadingItems: true,
  refreshDegenBalance: () => {},
};

const NFTsBalanceContext = createContext<NFTsBalanceContext>(CONTEXT_INITIAL_STATE);

export const NFTsBalanceProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const firstRenderRef = useRef(true);
  const { isLoggedIn } = useAuth();
  const { address, imxContracts } = useIMXContext();

  // Load user DEGEN balances from Subgraph
  const { isFetching, data: owner, refetch: refreshDegenBalance } = useOwnerSearch();
  const { characterCount: degenCount = 0 } = owner || {};
  const isDegenOwner = degenCount > 0;

  const degensBalance = useMemo(() => {
    const characterList = owner?.characters ? [...owner.characters] : [];
    return characterList.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  }, [owner]);

  const degenTokenIndices = useMemo(() => degensBalance.map(d => parseInt(d.id, 10)), [degensBalance]);

  // Load user Immutable zkEVM NFT balances
  const { comicsBalance, loading: loadingComics } = useComicsBalance(imxContracts, address);
  const { itemsBalance, loading: loadingItems } = useItemsBalance(imxContracts, address);

  // Refetch on login state change, avoiding initial render
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (!isLoggedIn) return;
    refreshDegenBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <NFTsBalanceContext.Provider
      value={{
        comicsBalance,
        degenCount,
        degensBalance,
        degenTokenIndices,
        isDegenOwner,
        itemsBalance,
        loadingComics,
        loadingDegens: isFetching,
        loadingItems,
        refreshDegenBalance,
      }}
    >
      {children}
    </NFTsBalanceContext.Provider>
  );
};

export default NFTsBalanceContext;
