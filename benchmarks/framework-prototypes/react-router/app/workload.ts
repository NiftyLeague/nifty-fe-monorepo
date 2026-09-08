export function readBenchmarkInteger(value: string | null, fallback: number, maximum = 200) {
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed >= 0 ? Math.min(parsed, maximum) : fallback
}

export function readBenchmarkProfile(value: string | null) {
  return value || 'generic'
}
