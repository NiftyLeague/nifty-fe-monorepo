import { Show } from 'solid-js'
import { useAccount, useDisconnect } from '@/runtime/wagmi'
import { buttonVariants } from '@nl/ui/base/button-variants'
import useAuth from '@/hooks/useAuth'

interface LogoutButtonProps {
  class?: string
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
        class={buttonVariants({ variant: 'outline', className: props.class ?? '' })}
        onClick={() => disconnect(undefined)}
      >
        {auth.isLoggedIn ? 'Log Out' : 'Disconnect Wallet'}
      </button>
    </Show>
  )
}

export default LogoutButton
