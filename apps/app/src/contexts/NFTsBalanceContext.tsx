'use client';

import { createContext, useEffect, useRef, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import type { Character } from '@/types/graph';
import type { Comic, Item } from '@/types/marketplace';

import { useOwnerSearch } from '@/hooks/useGraphQL';
import useAuth from '@/hooks/useAuth';
import useComicsBalances from '@/hooks/balances/useComicsBalances';
import useItemsBalances from '@/hooks/balances/useItemsBalances';

interface NFTsBalanceContext {
  comicsBalances: Comic[];
  degenCount: number;
  degensBalances: Character[];
  degenTokenIndices: number[];
  isDegenOwner: boolean;
  itemsBalances: Item[];
  loadingComics: boolean;
  loadingDegens: boolean;
  loadingItems: boolean;
  refreshComicsBalances: () => void;
  refreshDegenBalances: () => void;
  refreshItemsBalances: () => void;
}

const CONTEXT_INITIAL_STATE: NFTsBalanceContext = {
  comicsBalances: [],
  degenCount: 0,
  degensBalances: [],
  degenTokenIndices: [],
  isDegenOwner: false,
  itemsBalances: [],
  loadingComics: true,
  loadingDegens: false,
  loadingItems: true,
  refreshComicsBalances: () => {},
  refreshDegenBalances: () => {},
  refreshItemsBalances: () => {},
};

const NFTsBalanceContext = createContext<NFTsBalanceContext>(CONTEXT_INITIAL_STATE);

export const NFTsBalanceProvider = ({ children }: PropsWithChildren): React.ReactNode => {
  const firstRenderRef = useRef(true);
  const { isLoggedIn } = useAuth();

  // Load user DEGEN balances from Subgraph
  const { isFetching, data: owner, refetch: refreshDegenBalances } = useOwnerSearch();
  const { characterCount: degenCount = 0 } = owner || {};
  const isDegenOwner = degenCount > 0;

  const degensBalances = useMemo(() => {
    const characterList = owner?.characters ? [...owner.characters] : [];
    return characterList.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  }, [owner]);

  const degenTokenIndices = useMemo(() => degensBalances.map(d => parseInt(d.id, 10)), [degensBalances]);

  // Load user Immutable zkEVM NFT balances
  const { balances: comicsBalances, loading: loadingComics, refetch: refreshComicsBalances } = useComicsBalances();
  const { balances: itemsBalances, loading: loadingItems, refetch: refreshItemsBalances } = useItemsBalances();

  // Refetch on login state change, avoiding initial render
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (!isLoggedIn) return;
    refreshComicsBalances();
    refreshDegenBalances();
    refreshItemsBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <NFTsBalanceContext.Provider
      value={{
        comicsBalances,
        degenCount,
        degensBalances,
        degenTokenIndices,
        isDegenOwner,
        itemsBalances,
        loadingComics,
        loadingDegens: isFetching,
        loadingItems,
        refreshComicsBalances,
        refreshDegenBalances,
        refreshItemsBalances,
      }}
    >
      {children}
    </NFTsBalanceContext.Provider>
  );
};

export default NFTsBalanceContext;
