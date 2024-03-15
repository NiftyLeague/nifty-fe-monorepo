'use client';

import { createContext, type PropsWithChildren } from 'react';
import { useGamerProfile } from '@/hooks/useGamerProfile';
import useComicsBalance from '@/hooks/useComicsBalance';
import useBalances from '@/hooks/useBalances';

type GamerProfileContextType = {
  isLoadingProfile: boolean | undefined;
  isLoadingDegens: boolean | undefined;
  isLoadingComics: boolean | undefined;
};

const defaultValue: GamerProfileContextType = {
  isLoadingProfile: true,
  isLoadingDegens: true,
  isLoadingComics: true,
};

const GamerProfileContext = createContext<GamerProfileContextType>(defaultValue);

export const GamerProfileProvider = ({ children }: PropsWithChildren) => {
  const { loading: loadingDegens } = useBalances();
  const { loadingProfile } = useGamerProfile();
  const { loading: loadingComics } = useComicsBalance();

  return (
    <GamerProfileContext.Provider
      value={{
        isLoadingProfile: loadingProfile,
        isLoadingDegens: loadingDegens,
        isLoadingComics: loadingComics,
      }}
    >
      {children}
    </GamerProfileContext.Provider>
  );
};

export default GamerProfileContext;
