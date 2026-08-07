import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@nl/ui/base/button'
import useAuth from '@/hooks/useAuth'

export interface LogoutButtonProps {
  sx?: React.CSSProperties
}

const LogoutButton: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<LogoutButtonProps>>
> = ({ sx }) => {
  const { isConnected } = useAccount()
  const { isLoggedIn } = useAuth()
  const { disconnect } = useDisconnect()
  if (isConnected) {
    return (
      <Button style={sx} variant="outline" onClick={() => disconnect()} className="cursor-pointer">
        {isLoggedIn ? 'Log Out' : 'Disconnect Wallet'}
      </Button>
    )
  }
  return null
}

export default LogoutButton
