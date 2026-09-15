import { Show } from 'solid-js'
import { useAccount, useDisconnect } from '@/runtime/wagmi'
import { buttonVariants } from '@nl/ui/base/button-variants'
import useAuth from '@/hooks/useAuth'
import type { JSX } from 'solid-js'

interface LogoutButtonProps {
  sx?: JSX.CSSProperties
}

const LogoutButton = (props: LogoutButtonProps) => {
  const account = useAccount()
  const auth = useAuth()
  const { disconnect } = useDisconnect()

  return (
    <Show when={account.isConnected}>
      <button
        type="button"
        data-slot="button"
        style={props.sx}
        class={buttonVariants({ variant: 'outline', className: 'cursor-pointer' })}
        onClick={() => disconnect(undefined)}
      >
        {auth.isLoggedIn ? 'Log Out' : 'Disconnect Wallet'}
      </button>
    </Show>
  )
}

export default LogoutButton
