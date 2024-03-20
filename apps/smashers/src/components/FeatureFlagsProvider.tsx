import { createContext, ReactNode, useState } from 'react';

const DEFAULT_FLAGS = {
  enableAccountCreation: false,
  enableAvatars: false,
  enableInventory: false,
  enableIOS: false,
  enableLinkProviders: true,
  enableLinkWallet: true,
  enableProviderSignOn: false,
  enableStats: false,
  enableWebGL: false,
} as FlagSet;

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

function useProcessFlagsFromEnv() {
  const [flags] = useState<FlagSet>(() => {
    const storedValue = process.env.NEXT_PUBLIC_FEATURE_FLAGS;
    return storedValue === undefined ? DEFAULT_FLAGS : { ...DEFAULT_FLAGS, ...JSON.parse(storedValue) };
  });

  return { flags };
}

type ConfigProviderProps = {
  children: ReactNode;
};

export function FeatureFlagProvider({ children }: ConfigProviderProps) {
  const { flags } = useProcessFlagsFromEnv();

  return <FeatureFlagContext.Provider value={{ flags }}>{children}</FeatureFlagContext.Provider>;
}
