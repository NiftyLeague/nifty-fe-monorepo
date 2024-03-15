'use client';

import { createContext, type PropsWithChildren, useState } from 'react';

/**
 * A map of feature flags from their keys to their values.
 */
export type FlagSet = { [camelCasedKey: string]: boolean };

/**
 * The sdk context stored in the Provider state and passed to consumers.
 */
export type ProviderConfig = { flags: FlagSet };

// ==============================|| FEATURE FLAG CONTEXT & PROVIDER ||============================== //

const initialState: ProviderConfig = { flags: {} };
export const FeatureFlagContext = createContext<ProviderConfig>(initialState);

function useProcessFlagsFromEnv(key: string, defaultValue: FlagSet) {
  const [flags] = useState<FlagSet>(() => {
    const storedValue = process.env[key];
    return storedValue === undefined ? defaultValue : { ...defaultValue, ...JSON.parse(storedValue) };
  });

  return { flags };
}

export function FeatureFlagProvider({ children }: PropsWithChildren) {
  const { flags } = useProcessFlagsFromEnv('NEXT_PUBLIC_FEATURE_FLAGS', {
    displayMyItems: false,
    enableEquip: false,
  });

  return <FeatureFlagContext.Provider value={{ flags }}>{children}</FeatureFlagContext.Provider>;
}
