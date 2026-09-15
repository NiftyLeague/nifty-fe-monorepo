import type { ParentComponent } from 'solid-js'

import { AuthProvider } from './AuthProvider'
import { FeatureFlagProvider } from './FeatureFlagsProvider'

const AuthProviders: ParentComponent = (props) => (
  <FeatureFlagProvider>
    <AuthProvider>{props.children}</AuthProvider>
  </FeatureFlagProvider>
)

export default AuthProviders
