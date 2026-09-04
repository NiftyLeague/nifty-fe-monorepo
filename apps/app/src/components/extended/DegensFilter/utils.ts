import type { Dispatch, SetStateAction } from 'react'
import type { PublicDegen } from '@/types/degens'
import type { DegenFilter } from '@/types/degenFilter'
import DEFAULT_STATIC_FILTER from './constants'
import { BURN_ADDYS } from '@/constants/addresses'
import { HYDRA_RARITIES } from '@/constants/hydra-rarities'

export const transformDataByFilter = <T extends PublicDegen>(
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

  const result = degens.filter(
    ({
      background = '',
      id = '',
      name = '',
      owner = '',
      traits_string = '',
      tribe = '',
    }: PublicDegen) => {
      // Filter all burn addys
      if (BURN_ADDYS.includes(owner)) return false

      if (
        normalizedWalletAddress &&
        normalizedWalletAddress.length > 26 &&
        owner.toLowerCase() !== normalizedWalletAddress
      ) {
        return false
      }

      if (normalizedTokenId && normalizedTokenId.length > 0 && id !== normalizedTokenId) {
        return false
      }

      if (
        normalizedTribes.size > 0 &&
        !normalizedTribes.has(tribe?.toLocaleLowerCase() || (!tribe ? 'hydra' : ''))
      ) {
        return false
      }

      if (
        normalizedBackgrounds.size > 0 &&
        !normalizedBackgrounds.has(background?.toLocaleLowerCase())
      ) {
        return false
      }

      if (
        hasCosmeticsFilter &&
        !traits_string.split(',').some((trait) => normalizedCosmetics.has(trait))
      ) {
        return false
      }

      if (
        normalizedSearchTerm &&
        !(
          name?.toLowerCase().includes(normalizedSearchTerm) ||
          id.toLocaleLowerCase().includes(normalizedSearchTerm)
        )
      ) {
        return false
      }

      return true
    }
  )

  if (sort === 'idUp') {
    result.sort((a, b) => Number(a.id) - Number(b.id))
  } else if (sort === 'idDown') {
    result.sort((a, b) => Number(b.id) - Number(a.id))
  }
  return result
}

type FilterActionMap = Record<string, Dispatch<SetStateAction<any>>>

const SINGLE_VALUE_KEYS = new Set<keyof DegenFilter>(['searchTerm', 'walletAddress', 'tokenId'])

export const updateFilterValue = (
  defaultFilter?: DegenFilter,
  params?: Record<string, string>,
  actions?: FilterActionMap
): DegenFilter | undefined => {
  const newFilter: DegenFilter = { ...defaultFilter } as DegenFilter
  if (!params) return newFilter
  for (const [rawKey, value] of Object.entries(params)) {
    const key = rawKey as keyof DegenFilter
    if (SINGLE_VALUE_KEYS.has(key)) {
      ;(newFilter as unknown as Record<string, unknown>)[key] = [value as string]
      continue
    }
    if (!value) return undefined
    const newValue = key === 'prices' ? value.split('-').map(Number) : value.split('-').map(String)
    actions?.[key]?.(newValue.length > 0 ? newValue : (DEFAULT_STATIC_FILTER[key] as unknown[]))
    ;(newFilter as unknown as Record<string, unknown>)[key] = newValue
  }
  return newFilter
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
