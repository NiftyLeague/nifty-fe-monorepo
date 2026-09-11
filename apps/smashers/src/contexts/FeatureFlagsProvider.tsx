'use client'

import { createContext, ReactNode, useState } from 'react'

const DEFAULT_FLAGS = {
  enableAccountCreation: false,
  enableAvatars: false,
  enableInventory: false,
  enableLinkProviders: true,
  enableLinkWallet: true,
  enableProviderSignOn: false,
  enableStats: false,
  enableWebGL: false,
} as FlagSet

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

/**
 * Parse the configured flags, falling back to the defaults.
 *
 * Tolerant by necessity: an unset variable reaches the client as either
 * `undefined` or an empty string depending on how it was inlined, and an
 * unparseable value must not take the app down. A bare `JSON.parse('')` threw
 * during render, which crashed the entire island and left the login and profile
 * pages blank.
 *
 * Mirrors apps/app's `parseFeatureFlags` (including filtering to booleans) so
 * both apps interpret the same variable identically. Duplicated rather than
 * shared because it lives in an app-local context module there; worth lifting
 * into packages/ui if a third app needs it.
 */
export function parseFlags(
  storedValue: string | undefined,
  defaults: FlagSet = DEFAULT_FLAGS
): FlagSet {
  if (!storedValue || storedValue.trim() === '') return { ...defaults }

  try {
    const parsed: unknown = JSON.parse(storedValue)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ...defaults }

    const booleanFlags = Object.fromEntries(
      Object.entries(parsed).filter(([, flag]) => typeof flag === 'boolean')
    )
    return { ...defaults, ...booleanFlags }
  } catch {
    console.warn('Ignoring NEXT_PUBLIC_FEATURE_FLAGS: value is not valid JSON')
    return { ...defaults }
  }
}

function useProcessFlagsFromEnv() {
  const [flags] = useState<FlagSet>(() => parseFlags(process.env.NEXT_PUBLIC_FEATURE_FLAGS))

  return { flags }
}

type ConfigProviderProps = { children: ReactNode }

export function FeatureFlagProvider({ children }: ConfigProviderProps) {
  const { flags } = useProcessFlagsFromEnv()

  return <FeatureFlagContext.Provider value={{ flags }}>{children}</FeatureFlagContext.Provider>
}
