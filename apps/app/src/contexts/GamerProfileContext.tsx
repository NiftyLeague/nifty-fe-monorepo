'use client';

import { createContext, type PropsWithChildren } from 'react';
import { useGamerProfile } from '@/hooks/useGamerProfile';
import useIMXContext from '@/hooks/useIMXContext';
import useBalances from '@/hooks/useBalances';

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
  const { loadingDegens } = useBalances();
  const { loadingProfile } = useGamerProfile();
  const { comicsLoading, itemsLoading } = useIMXContext();

  return (
    <GamerProfileContext.Provider
      value={{
        isLoadingProfile: loadingProfile,
        isLoadingDegens: loadingDegens,
        isLoadingComics: comicsLoading,
        isLoadingItems: itemsLoading,
      }}
    >
      {children}
    </GamerProfileContext.Provider>
  );
};

export default GamerProfileContext;
