import type { JSX } from 'solid-js'

import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

interface WalletStorageProvidersProps {
  cookies?: string | null
  loadingFallback?: JSX.Element
  errorFallback?: (retry: () => void) => JSX.Element
  children?: JSX.Element
}

/** Shared storage and wallet-runtime shell for route-specific provider stacks. */
const WalletStorageProviders = (props: WalletStorageProvidersProps) => (
  <Web3ModalProvider
    cookies={props.cookies}
    errorFallback={props.errorFallback}
    loadingFallback={props.loadingFallback}
  >
    {props.children}
  </Web3ModalProvider>
)

export default WalletStorageProviders
