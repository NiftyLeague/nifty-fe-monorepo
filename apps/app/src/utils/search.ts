/**
 * Shared case-insensitive search helper.
 * Normalizes the query once and checks whether any of the provided field
 * accessors contain it. Used by dashboard list filters to avoid duplicating
 * the lowercasing + field-iteration pattern across components.
 */
export function matchesSearchTerm<T>(
  item: T,
  lowercasedQuery: string,
  getFields: (item: T) => (string | undefined | null)[]
): boolean {
  return getFields(item).some((field) => field?.toLowerCase().includes(lowercasedQuery) ?? false)
}

export function filterBySearch<T>(
  items: T[],
  searchTerm: string,
  getFields: (item: T) => (string | undefined | null)[]
): T[] {
  const trimmed = searchTerm.trim()
  if (!trimmed) return items
  const lowercasedValue = trimmed.toLowerCase()
  return items.filter((item) => matchesSearchTerm(item, lowercasedValue, getFields))
}
