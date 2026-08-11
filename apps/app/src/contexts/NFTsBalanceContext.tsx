'use client'

import { createContext, useEffect, useMemo, useRef } from 'react'
import type { PropsWithChildren } from 'react'
import type { Character } from '@/types/graph'
import type { Comic, Item } from '@/types/marketplace'

import useComicsBalances from '@/hooks/balances/useComicsBalances'
import useDegenOwnership from '@/hooks/balances/useDegenOwnership'
import useItemsBalances from '@/hooks/balances/useItemsBalances'
import useAuth from '@/hooks/useAuth'

interface NFTsBalanceContext {
  comicsBalances: Comic[]
  degenCount: number
  degensBalances: Character[]
  degenTokenIndices: number[]
  isDegenOwner: boolean
  itemsBalances: Item[]
  loadingComics: boolean
  loadingDegens: boolean
  loadingItems: boolean
  refreshComicsBalances: () => void
  refreshDegenBalances: () => void
  refreshItemsBalances: () => void
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
}

const NFTsBalanceContext = createContext<NFTsBalanceContext>(CONTEXT_INITIAL_STATE)

export const NFTsBalanceProvider = ({ children }: PropsWithChildren): React.ReactNode => {
  const firstRenderRef = useRef(true)
  const { isLoggedIn } = useAuth()
  const {
    degenCount,
    degensBalances,
    degenTokenIndices,
    isDegenOwner,
    loadingDegens,
    refreshDegenBalances,
  } = useDegenOwnership()

  // Load user Immutable zkEVM NFT balances
  const {
    balances: comicsBalances,
    loading: loadingComics,
    refetch: refreshComicsBalances,
  } = useComicsBalances()
  const {
    balances: itemsBalances,
    loading: loadingItems,
    refetch: refreshItemsBalances,
  } = useItemsBalances()

  // Refetch marketplace balances on login state change. DEGEN ownership has
  // the same lifecycle in its smaller, reusable ownership hook.
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    if (!isLoggedIn) return
    refreshComicsBalances()
    refreshItemsBalances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

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
        loadingDegens,
        loadingItems,
        refreshComicsBalances,
        refreshDegenBalances,
        refreshItemsBalances,
      }}
    >
      {children}
    </NFTsBalanceContext.Provider>
  )
}

export default NFTsBalanceContext
