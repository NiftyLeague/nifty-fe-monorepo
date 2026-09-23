/**
 * A map of feature flags from their keys to their boolean values.
 */
export type FlagSet = { [camelCasedKey: string]: boolean }

/**
 * Parse a feature flag string into a typed map of boolean flags, merging
 * with the provided defaults. Non-boolean values are filtered out.
 *
 * Tolerant by necessity: an unparseable value must not take the app down.
 */
export function parseFeatureFlags(
  value: string | undefined,
  defaults: FlagSet
): FlagSet {
  if (!value) return { ...defaults }

  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ...defaults }
    }

    const booleanFlags = Object.fromEntries(
      Object.entries(parsed).filter(([, flag]) => typeof flag === 'boolean')
    )

    return { ...defaults, ...booleanFlags }
  } catch {
    return { ...defaults }
  }
}
