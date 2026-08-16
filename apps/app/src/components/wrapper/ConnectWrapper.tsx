import { buttonVariants } from '@nl/ui/base/button-variants'
import useAuth from '@/hooks/useAuth'

export interface ConnectWrapperProps {
  variant?: 'contained' | 'outlined'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined
  fullWidth?: boolean
  children: React.ReactElement
  buttonText?: string
}

const ConnectWrapper = (props: ConnectWrapperProps) => {
  const { children, buttonText, variant = 'contained', color, fullWidth, ...otherProps } = props
  const { isConnected, isLoggedIn, handleConnectWallet } = useAuth()

  return isLoggedIn ? (
    children
  ) : (
    <button
      type="button"
      data-slot="button"
      className={buttonVariants({
        variant: variant === 'outlined' ? 'outline' : 'default',
        className: fullWidth ? 'w-full' : undefined,
      })}
      onClick={handleConnectWallet}
      {...otherProps}
    >
      {isConnected
        ? buttonText?.replace('Connect Wallet', 'Sign In') || 'Sign In'
        : buttonText || 'Connect Wallet'}
    </button>
  )
}

export default ConnectWrapper
