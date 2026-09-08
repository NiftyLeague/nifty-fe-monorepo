export type BenchmarkSearchParams = Promise<Record<string, string | string[] | undefined>>

export function readBenchmarkInteger(
  value: string | string[] | undefined,
  fallback: number,
  maximum = 200
) {
  const parsed = Number(Array.isArray(value) ? value[0] : value)
  return Number.isSafeInteger(parsed) && parsed >= 0 ? Math.min(parsed, maximum) : fallback
}

export function readBenchmarkProfile(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? 'generic'
}
