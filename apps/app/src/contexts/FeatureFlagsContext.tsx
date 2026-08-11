'use client'

import { createContext, type PropsWithChildren, useState } from 'react'

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

function useProcessFlagsFromEnv(key: string, defaultValue: FlagSet) {
  const [flags] = useState<FlagSet>(() => {
    return parseFeatureFlags(process.env[key], defaultValue)
  })

  return { flags }
}

export function FeatureFlagProvider({ children }: PropsWithChildren) {
  const { flags } = useProcessFlagsFromEnv('NEXT_PUBLIC_FEATURE_FLAGS', {
    displayMyItems: false,
    enableEquip: false,
  })

  return <FeatureFlagContext.Provider value={{ flags }}>{children}</FeatureFlagContext.Provider>
}
