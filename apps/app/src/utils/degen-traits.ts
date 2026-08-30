import { getTraitDisplay } from '@/constants/cosmeticsFilters'
import { TRAIT_INDEXES } from '@/constants/traitIndexes'

export type DegenTraitValue = bigint | number | string

export interface DegenTraitEntry {
  key: string
  index?: number
  name?: string
  value: string
}

const TRAIT_INDEX_BY_TYPE = Object.fromEntries(
  Object.entries(TRAIT_INDEXES).map(([index, traitType]) => [traitType, Number(index)])
) as Record<string, number>

const getTraitEntry = (
  rawValue: DegenTraitValue,
  index: number | undefined,
  key: string
): DegenTraitEntry | null => {
  const value = String(rawValue).trim()
  if (!value) return null

  if (!/^\d+$/.test(value)) {
    return { key: `${index ?? key}-${value}`, index, value }
  }

  // Contract tuples use zero for an empty cosmetic slot.
  if (/^0+$/.test(value)) return null

  return {
    key: `${index ?? key}-${value}`,
    index,
    ...getTraitDisplay(value, index),
  }
}

const getRecordTraitEntry = ([key, rawValue]: [string, DegenTraitValue]) => {
  const index = /^\d+$/.test(key) ? Number(key) : TRAIT_INDEX_BY_TYPE[key]
  const traitType = index === undefined ? key : (TRAIT_INDEXES[index] ?? key)
  const value = String(rawValue).trim()

  // Dashboard contract data is numeric. Keep malformed metadata out of the
  // trait grid while allowing the public comma-separated catalog to retain
  // its historical named values through the string path below.
  if (!/^\d+$/.test(value)) return null

  return getTraitEntry(value, index, traitType)
}

export function getDegenTraitEntries(
  traits: string | readonly DegenTraitValue[] | Record<string, DegenTraitValue> | undefined
): DegenTraitEntry[] {
  if (!traits) return []

  if (typeof traits === 'string') {
    return traits
      .split(',')
      .map((value, index) => getTraitEntry(value, index, value.trim()))
      .filter((entry): entry is DegenTraitEntry => entry !== null)
  }

  if (Array.isArray(traits)) {
    return traits
      .map((value, index) => getTraitEntry(value, index, String(index)))
      .filter((entry): entry is DegenTraitEntry => entry !== null)
  }

  return Object.entries(traits)
    .map((entry) => getRecordTraitEntry(entry as [string, DegenTraitValue]))
    .filter((entry): entry is DegenTraitEntry => entry !== null)
}
