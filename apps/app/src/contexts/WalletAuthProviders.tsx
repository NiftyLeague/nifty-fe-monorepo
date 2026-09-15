import type { JSX } from 'solid-js'

import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import WalletStorageProviders from '@/contexts/WalletStorageProviders'

interface WalletAuthProvidersProps {
  cookies?: string | null
  loadingFallback?: JSX.Element
  errorFallback?: (retry: () => void) => JSX.Element
  children?: JSX.Element
}

const WalletAuthProviders = (props: WalletAuthProvidersProps) => (
  <WalletStorageProviders
    cookies={props.cookies}
    errorFallback={props.errorFallback}
    loadingFallback={props.loadingFallback}
  >
    <AuthStatusProvider>
      <AuthTokenProvider>{props.children}</AuthTokenProvider>
    </AuthStatusProvider>
  </WalletStorageProviders>
)

export default WalletAuthProviders
