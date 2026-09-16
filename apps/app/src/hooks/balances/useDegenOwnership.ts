import { createEffect, createMemo, on } from 'solid-js'

import { useOwnerSearch } from '@/hooks/useGraphQL'
import useAuth from '@/hooks/useAuth'
import type { Character } from '@/types/graph'

interface DegenOwnershipState {
  readonly degenCount: number
  readonly degensBalances: Character[]
  readonly degenTokenIndices: number[]
  readonly isDegenOwner: boolean
  readonly loadingDegens: boolean
  refreshDegenBalances: () => void
}

export default function useDegenOwnership(): DegenOwnershipState {
  const auth = useAuth()
  const ownerQuery = useOwnerSearch()

  const owner = () => ownerQuery.data
  const degenCount = () => owner()?.characterCount ?? 0

  const degensBalances = createMemo<Character[]>(() => {
    const characters = owner()?.characters
    return characters ? characters.map((degen) => ({ ...degen, id: degen.tokenId.toString() })) : []
  })

  const degenTokenIndices = createMemo(() =>
    degensBalances().map((degen) => parseInt(degen.id, 10))
  )

  createEffect(
    on(
      () => auth.isLoggedIn,
      (loggedIn) => {
        if (!loggedIn) return
        void ownerQuery.refetch()
      },
      { defer: true }
    )
  )

  return {
    get degenCount() {
      return degenCount()
    },
    get degensBalances() {
      return degensBalances()
    },
    get degenTokenIndices() {
      return degenTokenIndices()
    },
    get isDegenOwner() {
      return degenCount() > 0
    },
    get loadingDegens() {
      return ownerQuery.isFetching
    },
    refreshDegenBalances: () => void ownerQuery.refetch(),
  }
}
