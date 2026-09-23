import { createContext, type JSX } from 'solid-js'

import { FEATURE_FLAGS } from '@/runtime/env'
import { parseFeatureFlags, type FlagSet } from '@nl/ui/lib/parse-feature-flags'

export type { FlagSet }

/**
 * The sdk context stored in the Provider state and passed to consumers.
 */
export type ProviderConfig = { flags: FlagSet }

// ==============================|| FEATURE FLAG CONTEXT & PROVIDER ||============================== //

const initialState: ProviderConfig = { flags: {} }
export const FeatureFlagContext = createContext<ProviderConfig>(initialState)

export function FeatureFlagProvider(props: { children?: JSX.Element }) {
  const value: ProviderConfig = {
    flags: parseFeatureFlags(FEATURE_FLAGS, {
      displayMyItems: false,
      enableEquip: false,
    }),
  }

  return <FeatureFlagContext.Provider value={value}>{props.children}</FeatureFlagContext.Provider>
}
