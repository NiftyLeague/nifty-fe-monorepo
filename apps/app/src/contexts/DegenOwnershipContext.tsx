'use client'

import { createContext, useContext, type PropsWithChildren } from 'react'

import useDegenOwnership, { type DegenOwnershipState } from '@/hooks/balances/useDegenOwnership'

const CONTEXT_INITIAL_STATE: DegenOwnershipState = {
  degenCount: 0,
  degensBalances: [],
  degenTokenIndices: [],
  isDegenOwner: false,
  loadingDegens: false,
  refreshDegenBalances: () => {},
}

const DegenOwnershipContext = createContext<DegenOwnershipState>(CONTEXT_INITIAL_STATE)

export const DegenOwnershipProvider = ({ children }: PropsWithChildren): React.ReactNode => {
  const ownership = useDegenOwnership()

  return (
    <DegenOwnershipContext.Provider value={ownership}>{children}</DegenOwnershipContext.Provider>
  )
}

export const useDegenOwnershipContext = () => useContext(DegenOwnershipContext)

export default DegenOwnershipContext
