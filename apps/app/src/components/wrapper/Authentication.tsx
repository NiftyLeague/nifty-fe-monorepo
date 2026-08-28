import { Button } from '@nl/ui/base/button'
import useAuth from '@/hooks/useAuth'

const ProfileVerification = (): React.ReactNode => {
  const { isConnected, handleConnectWallet } = useAuth()

  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center p-10 text-center lg:min-h-[calc(100dvh-60px)]">
      <p className="mb-2">
        {isConnected ? 'Please sign message to log in' : 'Please connect your wallet'}
      </p>
      <Button variant="default" onClick={handleConnectWallet}>
        {isConnected ? 'Log In' : 'Connect Wallet'}
      </Button>
    </div>
  )
}

export default function withVerification<P>(
  Component: React.ComponentType<P>
): React.ComponentType<React.PropsWithChildren<P>> {
  const WrappedComponent = (props: React.PropsWithChildren<P>) => {
    const { isLoggedIn } = useAuth()
    return isLoggedIn ? <Component {...props} /> : <ProfileVerification />
  }

  WrappedComponent.displayName = `withVerification(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
