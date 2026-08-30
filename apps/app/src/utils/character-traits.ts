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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object'

/**
 * Ethers returns ABI structs as array-like Results, but other contract clients
 * expose the same CharacterTraits tuple as a named object. Normalize both
 * shapes before the modal maps trait indexes to display labels.
 */
export const normalizeCharacterTraits = (value: unknown): bigint[] => {
  if (Array.isArray(value)) {
    const firstValue = value[0]

    // Some contract clients preserve the ABI's single tuple output wrapper.
    // Unwrap it before converting values so the tuple indexes stay aligned.
    if (value.length === 1 && (Array.isArray(firstValue) || isRecord(firstValue))) {
      return normalizeCharacterTraits(firstValue)
    }

    return value.map(toBigInt)
  }
  if (!isRecord(value)) return []

  const record = value
  const nestedTraits = record._characterTraits ?? record.characterTraits
  if (Array.isArray(nestedTraits) || isRecord(nestedTraits)) {
    return normalizeCharacterTraits(nestedTraits)
  }

  const indexedEntries = Object.entries(record)
    .filter(([key]) => /^\d+$/.test(key))
    .sort(([left], [right]) => Number(left) - Number(right))

  if (indexedEntries.length) return indexedEntries.map(([, trait]) => toBigInt(trait))

  return traitKeys.map((key) => toBigInt(record[key]))
}
