import { splitProps, type JSX } from 'solid-js'
import { buttonVariants } from '@nl/ui/base/button-variants'
import useAuth from '@/hooks/useAuth'

interface ConnectWrapperProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined
  fullWidth?: boolean
  children: JSX.Element
  buttonText?: string
}

const ConnectWrapper = (props: ConnectWrapperProps) => {
  const [local, otherProps] = splitProps(props, [
    'children',
    'buttonText',
    'variant',
    'color',
    'fullWidth',
  ])
  const auth = useAuth()

  return (
    <>
      {auth.isLoggedIn ? (
        local.children
      ) : (
        <button
          type="button"
          data-slot="button"
          class={buttonVariants({
            variant: local.variant === 'outlined' ? 'outline' : 'default',
            className: local.fullWidth ? 'w-full' : undefined,
          })}
          onClick={() => void auth.handleConnectWallet()}
          {...otherProps}
        >
          {auth.isConnected
            ? local.buttonText?.replace('Connect Wallet', 'Sign In') || 'Sign In'
            : local.buttonText || 'Connect Wallet'}
        </button>
      )}
    </>
  )
}

export default ConnectWrapper
