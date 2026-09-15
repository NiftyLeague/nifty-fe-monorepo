'use client'

import { createContext, createEffect, type JSX } from 'solid-js'
import type { Character } from '@/types/graph'
import type { Comic, Item } from '@/types/marketplace'

import useComicsBalances from '@/hooks/balances/useComicsBalances'
import useDegenOwnership from '@/hooks/balances/useDegenOwnership'
import useItemsBalances from '@/hooks/balances/useItemsBalances'
import useAuth from '@/hooks/useAuth'

export interface NFTsBalanceContextValue {
  readonly comicsBalances: Comic[]
  readonly degenCount: number
  readonly degensBalances: Character[]
  readonly degenTokenIndices: number[]
  readonly isDegenOwner: boolean
  readonly itemsBalances: Item[]
  readonly loadingComics: boolean
  readonly loadingDegens: boolean
  readonly loadingItems: boolean
  refreshComicsBalances: () => void
  refreshDegenBalances: () => void
  refreshItemsBalances: () => void
}

const CONTEXT_INITIAL_STATE: NFTsBalanceContextValue = {
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

const NFTsBalanceContext = createContext<NFTsBalanceContextValue>(CONTEXT_INITIAL_STATE)

export const NFTsBalanceProvider = (props: { children?: JSX.Element }): JSX.Element => {
  let firstRender = true
  const auth = useAuth()
  const degenOwnership = useDegenOwnership()

  // Load user Immutable zkEVM NFT balances
  const comics = useComicsBalances()
  const items = useItemsBalances()

  // Refetch marketplace balances on login state change. DEGEN ownership has
  // the same lifecycle in its smaller, reusable ownership hook.
  createEffect(() => {
    const loggedIn = auth.isLoggedIn
    if (firstRender) {
      firstRender = false
      return
    }
    if (!loggedIn) return
    comics.refetch()
    items.refetch()
  })

  const value: NFTsBalanceContextValue = {
    get comicsBalances() {
      return comics.balances
    },
    get degenCount() {
      return degenOwnership.degenCount
    },
    get degensBalances() {
      return degenOwnership.degensBalances
    },
    get degenTokenIndices() {
      return degenOwnership.degenTokenIndices
    },
    get isDegenOwner() {
      return degenOwnership.isDegenOwner
    },
    get itemsBalances() {
      return items.balances
    },
    get loadingComics() {
      return comics.loading
    },
    get loadingDegens() {
      return degenOwnership.loadingDegens
    },
    get loadingItems() {
      return items.loading
    },
    refreshComicsBalances: comics.refetch,
    refreshDegenBalances: degenOwnership.refreshDegenBalances,
    refreshItemsBalances: items.refetch,
  }

  return <NFTsBalanceContext.Provider value={value}>{props.children}</NFTsBalanceContext.Provider>
}

export default NFTsBalanceContext
