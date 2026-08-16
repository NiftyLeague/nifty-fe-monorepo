import { SetStateAction } from 'react'
import type { PublicDegen } from '@/types/degens'
import type { DegenFilter } from '@/types/degenFilter'
import DEFAULT_STATIC_FILTER from './constants'
import { BURN_ADDYS } from '@/constants/addresses'
import { HYDRA_RARITIES } from '@/constants/hydra-rarities'

type NormalizedDegen = {
  background: string
  id: string
  name: string
  numericId: number
  owner: string
  searchId: string
  tribe: string
}

// Catalog records are immutable after fetch, so reuse normalized fields across
// public and private filter passes instead of lowercasing every field on every
// keystroke or filter change.
const normalizedDegenCache = new WeakMap<PublicDegen, NormalizedDegen>()
const normalizedTraitsCache = new WeakMap<PublicDegen, string[]>()

const getNormalizedDegen = (degen: PublicDegen): NormalizedDegen => {
  const cached = normalizedDegenCache.get(degen)
  if (cached) return cached

  const normalized: NormalizedDegen = {
    background: degen.background?.toLocaleLowerCase() ?? '',
    id: degen.id ?? '',
    name: degen.name?.toLowerCase() ?? '',
    numericId: Number(degen.id),
    owner: degen.owner?.toLowerCase() ?? '',
    searchId: degen.id?.toLocaleLowerCase() ?? '',
    tribe: degen.tribe?.toLocaleLowerCase() || 'hydra',
  }
  normalizedDegenCache.set(degen, normalized)
  return normalized
}

const getNormalizedTraits = (degen: PublicDegen): string[] => {
  const cached = normalizedTraitsCache.get(degen)
  if (cached) return cached

  const traits = degen.traits_string?.split(',') ?? ['']
  normalizedTraitsCache.set(degen, traits)
  return traits
}

export const tranformDataByFilter = <T extends PublicDegen>(
  degens: T[],
  {
    backgrounds = [],
    cosmetics = [],
    searchTerm = [],
    sort,
    tokenId = [],
    tribes = [],
    walletAddress = [],
  }: DegenFilter
): T[] => {
  const normalizedWalletAddress = walletAddress[0]?.toLowerCase()
  const normalizedTokenId = tokenId[0]
  const normalizedSearchTerm = searchTerm.length === 1 ? searchTerm[0]?.toLowerCase() : undefined
  const normalizedTribes = new Set(tribes.map((tribe) => tribe.toLocaleLowerCase()))
  const normalizedBackgrounds = new Set(
    backgrounds.map((background) => background.toLocaleLowerCase())
  )
  const normalizedCosmetics = new Set(cosmetics)
  const hasCosmeticsFilter = cosmetics.length > 0

  const result = degens.filter((degen: PublicDegen) => {
    const { background, id, name, owner, searchId, tribe } = getNormalizedDegen(degen)

    // Filter all burn addys
    if (BURN_ADDYS.includes(degen.owner)) return false

    if (
      normalizedWalletAddress &&
      normalizedWalletAddress.length > 26 &&
      owner !== normalizedWalletAddress
    ) {
      return false
    }

    if (normalizedTokenId && normalizedTokenId.length > 0 && id !== normalizedTokenId) {
      return false
    }

    if (normalizedTribes.size > 0 && !normalizedTribes.has(tribe)) {
      return false
    }

    if (normalizedBackgrounds.size > 0 && !normalizedBackgrounds.has(background)) {
      return false
    }

    if (
      hasCosmeticsFilter &&
      !getNormalizedTraits(degen).some((trait) => normalizedCosmetics.has(trait))
    ) {
      return false
    }

    if (
      normalizedSearchTerm &&
      !(name.includes(normalizedSearchTerm) || searchId.includes(normalizedSearchTerm))
    ) {
      return false
    }

    return true
  })

  if (sort === 'idUp') {
    result.sort((a, b) => getNormalizedDegen(a).numericId - getNormalizedDegen(b).numericId)
  } else if (sort === 'idDown') {
    result.sort((a, b) => getNormalizedDegen(b).numericId - getNormalizedDegen(a).numericId)
  }
  return result
}

export const updateFilterValue = (
  defaultFilter?: DegenFilter,
  params?: { [key: string]: string },
  actions?: { [key: string]: React.Dispatch<SetStateAction<any[]>> }
) => {
  const newFilter: DegenFilter = { ...defaultFilter } as DegenFilter
  // eslint-disable-next-line guard-for-in
  for (const key in params) {
    const value = params[key as keyof DegenFilter]
    if (key === 'searchTerm' || key === 'walletAddress' || key === 'tokenId') {
      newFilter[key] = [value as string]
    } else {
      if (!value) {
        return
      }
      const newValue = value
        .split('-')
        .map((type: number | string) => (key === 'prices' ? Number(type) : String(type)))
      if (actions && actions[key])
        actions[key]?.(newValue || DEFAULT_STATIC_FILTER[key as keyof DegenFilter])
      // TypeScript limitation: dynamic key assignment to union types
      if (key === 'prices') {
        ;(newFilter as any)[key] = newValue as number[]
      } else {
        ;(newFilter as any)[key] = newValue as string[]
      }
    }
  }
  // eslint-disable-next-line consistent-return
  return newFilter as DegenFilter
}

export const getDefaultFilterValueFromData = (degens: PublicDegen[] | undefined) => {
  if (!degens?.length) {
    return DEFAULT_STATIC_FILTER
  }
  let minPrice = degens[0]?.price ?? 0
  let maxPrice = degens[0]?.price ?? 0

  degens.forEach((degen) => {
    const { price } = degen
    minPrice = price < minPrice ? price : minPrice
    maxPrice = price > maxPrice ? price : maxPrice
  })

  const newFilterValues = { ...DEFAULT_STATIC_FILTER, prices: [minPrice, maxPrice] }

  return newFilterValues
}

// Needs to be divisible by 2, 3, or 4
export const DEGENS_PER_PAGE = 12

export const getGridSizeClass = (isGridView: boolean, isDrawerOpen: boolean) => {
  if (isGridView) {
    return isDrawerOpen
      ? 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-4'
      : 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3'
  }
  return isDrawerOpen
    ? 'col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-3 xl:col-span-3'
    : 'col-span-6 sm:col-span-4 md:col-span-3 lg:col-span-2 xl:col-span-2'
}

// TODO: remove temp fix for 7th tribes once fetch data is updated
export const applySeventhTribesFix = <T extends PublicDegen>(degen: T): T => {
  if (Number(degen.id) <= 9900) {
    return degen
  }

  return {
    ...degen,
    background: HYDRA_RARITIES[degen.id] || 'Common',
    tribe: Number(degen.id) >= 9999 ? (Number(degen.id) === 9999 ? 'rugman' : 'satoshi') : 'hydra',
  } as T
}
