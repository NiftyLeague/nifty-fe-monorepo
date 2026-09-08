export function readBenchmarkInteger(value: unknown, fallback: number, maximum = 200) {
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed >= 0 ? Math.min(parsed, maximum) : fallback
}

export function readBenchmarkProfile(value: unknown) {
  return typeof value === 'string' && value ? value : 'generic'
}
