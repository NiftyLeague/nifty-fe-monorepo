import type { JSX } from 'solid-js'

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
    <AuthTokenProvider>{props.children}</AuthTokenProvider>
  </WalletStorageProviders>
)

export default WalletAuthProviders
