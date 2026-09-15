import { useAccount, useDisconnect } from 'wagmi'
import { buttonVariants } from '@nl/ui/base/button-variants'
import useAuth from '@/hooks/useAuth'

interface LogoutButtonProps {
  sx?: JSX.CSSProperties
}

const LogoutButton = (props: LogoutButtonProps) => {
  const { sx } = props
  const { isConnected } = useAccount()
  const { isLoggedIn } = useAuth()
  const { disconnect } = useDisconnect()
  if (isConnected) {
    return (
      <button
        type="button"
        data-slot="button"
        style={sx}
        class={buttonVariants({ variant: 'outline', className: 'cursor-pointer' })}
        onClick={() => disconnect()}
      >
        {isLoggedIn ? 'Log Out' : 'Disconnect Wallet'}
      </button>
    )
  }
  return null
}

export default LogoutButton
