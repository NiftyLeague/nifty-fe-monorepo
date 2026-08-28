import { TRAIT_INDEXES } from '@/constants/traitIndexes'

const traitKeys = Object.entries(TRAIT_INDEXES)
  .sort(([left], [right]) => Number(left) - Number(right))
  .map(([, key]) => key)

const toBigInt = (value: unknown): bigint => {
  if (typeof value === 'bigint') return value
  if (typeof value === 'number' && Number.isInteger(value)) return BigInt(value)
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return BigInt(value.trim())
  return 0n
}

/**
 * Ethers returns ABI structs as array-like Results, but other contract clients
 * expose the same CharacterTraits tuple as a named object. Normalize both
 * shapes before the modal maps trait indexes to display labels.
 */
export const normalizeCharacterTraits = (value: unknown): bigint[] => {
  if (Array.isArray(value)) return value.map(toBigInt)
  if (!value || typeof value !== 'object') return []

  const record = value as Record<string, unknown>
  return traitKeys.map((key) => toBigInt(record[key]))
}
