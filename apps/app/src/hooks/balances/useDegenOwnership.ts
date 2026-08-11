'use client'

import { useEffect, useMemo, useRef } from 'react'

import { useOwnerSearch } from '@/hooks/useGraphQL'
import useAuth from '@/hooks/useAuth'
import type { Character } from '@/types/graph'

export interface DegenOwnershipState {
  degenCount: number
  degensBalances: Character[]
  degenTokenIndices: number[]
  isDegenOwner: boolean
  loadingDegens: boolean
  refreshDegenBalances: () => void
}

export default function useDegenOwnership(): DegenOwnershipState {
  const firstRenderRef = useRef(true)
  const { isLoggedIn } = useAuth()
  const { isFetching, data: owner, refetch: refreshDegenBalances } = useOwnerSearch()
  const { characterCount: degenCount = 0 } = owner || {}
  const isDegenOwner = degenCount > 0

  const degensBalances = useMemo(() => {
    return owner?.characters
      ? owner.characters.map((degen) => ({ ...degen, id: degen.tokenId.toString() }))
      : []
  }, [owner])

  const degenTokenIndices = useMemo(
    () => degensBalances.map((degen) => parseInt(degen.id, 10)),
    [degensBalances]
  )

  useEffect(() => {
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
