'use client'

import { createContext, useMemo, type PropsWithChildren } from 'react'
import { useGamerProfile } from '@/hooks/useGamerProfile'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import type { Profile } from '@/types/account'

type GamerProfileContextType = {
  isLoadingProfile: boolean | undefined
  isLoadingDegens: boolean | undefined
  isLoadingComics: boolean | undefined
  isLoadingItems: boolean | undefined
  fetchUserProfile?: () => Promise<Profile | undefined>
}

const defaultValue: GamerProfileContextType = {
  isLoadingProfile: true,
  isLoadingDegens: true,
  isLoadingComics: true,
  isLoadingItems: true,
}

const GamerProfileContext = createContext<GamerProfileContextType>(defaultValue)

export const GamerProfileProvider = ({ children }: PropsWithChildren) => {
  const { loadingDegens, loadingComics, loadingItems } = useNFTsBalances()
  const { loadingProfile, fetchUserProfile } = useGamerProfile()
  const value = useMemo(
    () => ({
      isLoadingProfile: loadingProfile,
      isLoadingDegens: loadingDegens,
      isLoadingComics: loadingComics,
      isLoadingItems: loadingItems,
      fetchUserProfile,
    }),
    [fetchUserProfile, loadingComics, loadingDegens, loadingItems, loadingProfile]
  )

  return <GamerProfileContext.Provider value={value}>{children}</GamerProfileContext.Provider>
}

export default GamerProfileContext
