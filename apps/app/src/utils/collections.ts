export function hasEntries(value: object | null | undefined): boolean {
  return value !== null && value !== undefined && Object.keys(value).length > 0
}

export function toggleValue<T>(values: readonly T[], value: T): T[] {
  const index = values.indexOf(value)
  if (index === -1) return [...values, value]
  return values.filter((_, currentIndex) => currentIndex !== index)
}
