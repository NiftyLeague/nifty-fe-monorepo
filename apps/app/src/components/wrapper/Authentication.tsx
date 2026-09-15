import { Show, type Component, type JSX } from 'solid-js'
import { Button } from '@nl/ui/base/button'
import useAuth from '@/hooks/useAuth'

const ProfileVerification = (): JSX.Element => {
  const auth = useAuth()

  return (
    <div class="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center p-10 text-center lg:min-h-[calc(100dvh-60px)]">
      <p class="mb-2">
        {auth.isConnected ? 'Please sign message to log in' : 'Please connect your wallet'}
      </p>
      <Button variant="default" onClick={auth.handleConnectWallet}>
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
        <Wrapped {...props} />
      </Show>
    )
  }

  return VerifiedComponent
}
