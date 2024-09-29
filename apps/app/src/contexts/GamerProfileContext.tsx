'use client';

import { createContext, type PropsWithChildren } from 'react';
import { useGamerProfile } from '@/hooks/useGamerProfile';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';

type GamerProfileContextType = {
  isLoadingProfile: boolean | undefined;
  isLoadingDegens: boolean | undefined;
  isLoadingComics: boolean | undefined;
  isLoadingItems: boolean | undefined;
};

const defaultValue: GamerProfileContextType = {
  isLoadingProfile: true,
  isLoadingDegens: true,
  isLoadingComics: true,
  isLoadingItems: true,
};

const GamerProfileContext = createContext<GamerProfileContextType>(defaultValue);

export const GamerProfileProvider = ({ children }: PropsWithChildren) => {
  const { loadingDegens, loadingComics, loadingItems } = useNFTsBalances();
  const { loadingProfile } = useGamerProfile();

  return (
    <GamerProfileContext.Provider
      value={{
        isLoadingProfile: loadingProfile,
        isLoadingDegens: loadingDegens,
        isLoadingComics: loadingComics,
        isLoadingItems: loadingItems,
      }}
    >
      {children}
    </GamerProfileContext.Provider>
  );
};

export default GamerProfileContext;
