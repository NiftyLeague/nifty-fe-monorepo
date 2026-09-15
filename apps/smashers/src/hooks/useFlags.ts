import { useContext } from 'solid-js'
import {
  FeatureFlagContext,
  type FlagSet,
  type ProviderConfig,
} from '@/contexts/FeatureFlagsProvider'

/**
 * `useFlags` returns all feature flags. It reads the context populated from
 * environment vars by the FeatureFlagProvider.
 */
const useFlags = <T extends FlagSet = FlagSet>(): T => {
  const { flags } = useContext<ProviderConfig>(FeatureFlagContext)

  return flags as T
}

export default useFlags
