import { createContext, type JSX } from 'solid-js'

import { FEATURE_FLAGS } from '@/runtime/env'

/**
 * A map of feature flags from their keys to their values.
 */
export type FlagSet = { [camelCasedKey: string]: boolean }

/**
 * The sdk context stored in the Provider state and passed to consumers.
 */
export type ProviderConfig = { flags: FlagSet }

// ==============================|| FEATURE FLAG CONTEXT & PROVIDER ||============================== //

const initialState: ProviderConfig = { flags: {} }
export const FeatureFlagContext = createContext<ProviderConfig>(initialState)

export function parseFeatureFlags(value: string | undefined, defaultValue: FlagSet): FlagSet {
  if (!value) return { ...defaultValue }

  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ...defaultValue }
    }

    const booleanFlags = Object.fromEntries(
      Object.entries(parsed).filter(([, flag]) => typeof flag === 'boolean')
    )

    return { ...defaultValue, ...booleanFlags }
  } catch {
    return { ...defaultValue }
  }
}

export function FeatureFlagProvider(props: { children?: JSX.Element }) {
  const value: ProviderConfig = {
    flags: parseFeatureFlags(FEATURE_FLAGS, {
      displayMyItems: false,
      enableEquip: false,
    }),
  }

  return <FeatureFlagContext.Provider value={value}>{props.children}</FeatureFlagContext.Provider>
}
