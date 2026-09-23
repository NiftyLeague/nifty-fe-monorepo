import { createContext, type JSX } from 'solid-js'

import { parseFeatureFlags, type FlagSet } from '@nl/ui/lib/parse-feature-flags'

export type { FlagSet }

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
 * The sdk context stored in the Provider and passed to consumers.
 */
export type ProviderConfig = { flags: FlagSet }

// ==============================|| FEATURE FLAG CONTEXT & PROVIDER ||============================== //

const initialState: ProviderConfig = { flags: {} }
export const FeatureFlagContext = createContext<ProviderConfig>(initialState)

export function FeatureFlagProvider(props: { children: JSX.Element }) {
  const flags = parseFeatureFlags(process.env.PUBLIC_FEATURE_FLAGS, DEFAULT_FLAGS)

  return (
    <FeatureFlagContext.Provider value={{ flags }}>{props.children}</FeatureFlagContext.Provider>
  )
}
