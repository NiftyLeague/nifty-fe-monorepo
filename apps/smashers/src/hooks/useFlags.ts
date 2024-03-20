import { useContext } from 'react';
import { FeatureFlagContext, FlagSet, ProviderConfig } from '@/components/FeatureFlagsProvider';

/**
 * `useFlags` is a custom hook which returns all feature flags. It uses the `useContext` primitive
 * to access the context set in environment vars
 *
 * @return All the feature flags configured
 */
const useFlags = <T extends FlagSet = FlagSet>(): T => {
  const { flags } = useContext<ProviderConfig>(FeatureFlagContext);

  return flags as T;
};

export default useFlags;
