'use client'

import { createEffect, createMemo } from 'solid-js'

import { useOwnerSearch } from '@/hooks/useGraphQL'
import useAuth from '@/hooks/useAuth'
import type { Character } from '@/types/graph'

interface DegenOwnershipState {
  degenCount: number
  degensBalances: Character[]
  degenTokenIndices: number[]
  isDegenOwner: boolean
  loadingDegens: boolean
  refreshDegenBalances: () => void
}

export default function useDegenOwnership(): DegenOwnershipState {
  let firstRenderRef: any = true
  const { isLoggedIn } = useAuth()
  const { isFetching, data: owner, refetch: refreshDegenBalances } = useOwnerSearch()
  const { characterCount: degenCount = 0 } = owner || {}
  const isDegenOwner = degenCount > 0

  const degensBalances = createMemo(() => {
    return owner?.characters
      ? owner.characters.map((degen) => ({ ...degen, id: degen.tokenId.toString() }))
      : []
  }, [owner])

  const degenTokenIndices = createMemo(
    () => degensBalances.map((degen) => parseInt(degen.id, 10)),
    [degensBalances]
  )

  createEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    if (!isLoggedIn) return
    refreshDegenBalances()
  }, [isLoggedIn, refreshDegenBalances])

  return {
    degenCount,
    degensBalances,
    degenTokenIndices,
    isDegenOwner,
    loadingDegens: isFetching,
    refreshDegenBalances,
  }
}
