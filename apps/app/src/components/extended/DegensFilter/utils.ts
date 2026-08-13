import { SetStateAction } from 'react'
import type { PublicDegen } from '@/types/degens'
import type { DegenFilter } from '@/types/degenFilter'
import DEFAULT_STATIC_FILTER from './constants'
import { BURN_ADDYS } from '@/constants/addresses'
import { HYDRA_RARITIES } from '@/constants/hydra-rarities'

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
