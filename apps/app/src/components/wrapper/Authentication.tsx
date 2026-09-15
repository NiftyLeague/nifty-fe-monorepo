import {  } from 'solid-js'
import { Button } from '@nl/ui/base/button'
import useAuth from '@/hooks/useAuth'

const ProfileVerification = (): JSX.Element => {
  const { isConnected, handleConnectWallet } = useAuth()

  return (
    <div class="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center p-10 text-center lg:min-h-[calc(100dvh-60px)]">
      <p class="mb-2">
        {isConnected ? 'Please sign message to log in' : 'Please connect your wallet'}
      </p>
      <Button variant="default" onClick={handleConnectWallet}>
        {isConnected ? 'Log In' : 'Connect Wallet'}
      </Button>
    </div>
  )
}

export default function withVerification<P>(
  Component: Component<P>
): Component<JSX.P & { children?: JSX.Element }> {
  const WrappedComponent = (props: JSX.P & { children?: JSX.Element }) => {
    const { isLoggedIn } = useAuth()
    return isLoggedIn ? (
      createElement(Component as Component<JSX.P & { children?: JSX.Element }>, props)
    ) : (
      <ProfileVerification />
    )
  }

  WrappedComponent.displayName = `withVerification(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
