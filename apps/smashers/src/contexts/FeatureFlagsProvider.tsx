import { createContext, type JSX } from 'solid-js'

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
 * The sdk context stored in the Provider and passed to consumers.
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
    console.warn('Ignoring PUBLIC_FEATURE_FLAGS: value is not valid JSON')
    return { ...defaults }
  }
}

export function FeatureFlagProvider(props: { children: JSX.Element }) {
  const flags = parseFlags(process.env.PUBLIC_FEATURE_FLAGS)

  return (
    <FeatureFlagContext.Provider value={{ flags }}>{props.children}</FeatureFlagContext.Provider>
  )
}
