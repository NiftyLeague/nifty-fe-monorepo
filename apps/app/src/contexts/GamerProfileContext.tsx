import { createContext, type JSX } from 'solid-js'
import { useGamerProfile } from '@/hooks/useGamerProfile'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import type { Profile } from '@/types/account'

export type GamerProfileContextType = {
  readonly isLoadingProfile: boolean | undefined
  readonly isLoadingDegens: boolean | undefined
  readonly isLoadingComics: boolean | undefined
  readonly isLoadingItems: boolean | undefined
  fetchUserProfile?: () => Promise<Profile | undefined>
}

const defaultValue: GamerProfileContextType = {
  isLoadingProfile: true,
  isLoadingDegens: true,
  isLoadingComics: true,
  isLoadingItems: true,
}

const GamerProfileContext = createContext<GamerProfileContextType>(defaultValue)

export const GamerProfileProvider = (props: { children?: JSX.Element }) => {
  const nfts = useNFTsBalances()
  const profile = useGamerProfile()

  const value: GamerProfileContextType = {
    get isLoadingProfile() {
      return profile.loadingProfile
    },
    get isLoadingDegens() {
      return nfts.loadingDegens
    },
    get isLoadingComics() {
      return nfts.loadingComics
    },
    get isLoadingItems() {
      return nfts.loadingItems
    },
    fetchUserProfile: profile.fetchUserProfile,
  }

  return <GamerProfileContext.Provider value={value}>{props.children}</GamerProfileContext.Provider>
}

export default GamerProfileContext
