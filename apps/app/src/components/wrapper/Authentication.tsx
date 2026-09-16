import { Show, type Component, type JSX } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Button } from '@nl/ui/base/button'
import useAuth from '@/hooks/useAuth'

const preloadWalletModal = () => {
  void import('@/contexts/WalletModal').then((modal) => modal.preloadWalletModal())
}

const ProfileVerification = (): JSX.Element => {
  const auth = useAuth()

  return (
    <div class="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center p-10 text-center lg:min-h-[calc(100dvh-60px)]">
      <p class="mb-2">
        {auth.isConnected ? 'Please sign message to log in' : 'Please connect your wallet'}
      </p>
      <Button
        variant="default"
        onClick={auth.handleConnectWallet}
        onPointerEnter={preloadWalletModal}
        onFocus={preloadWalletModal}
      >
        {auth.isConnected ? 'Log In' : 'Connect Wallet'}
      </Button>
    </div>
  )
}

export default function withVerification<P extends object>(Wrapped: Component<P>): Component<P> {
  const VerifiedComponent = (props: P) => {
    const auth = useAuth()
    return (
      <Show when={auth.isLoggedIn} fallback={<ProfileVerification />}>
        <Dynamic component={Wrapped} {...props} />
      </Show>
    )
  }

  return VerifiedComponent
}
