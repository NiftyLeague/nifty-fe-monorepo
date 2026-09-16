import { createEffect, createSignal, Show, type JSX } from 'solid-js'
import { useSearchParams } from '@/runtime/navigation'

import type { Nonce, UUID_Token } from '@/types/auth'
import useAuth from '@/hooks/useAuth'
import useSignAuthMsg from '@/hooks/useSignAuthMsg'

export default function VerificationClient(): JSX.Element {
  const searchParams = useSearchParams()
  const token = () => searchParams().get('token') as UUID_Token | undefined
  const nonce = () => searchParams().get('nonce') as Nonce | undefined
  const sign = useSignAuthMsg({ token, nonce })
  const auth = useAuth()
  const [msgSent, setMsgSent] = createSignal(false)

  createEffect(() => {
    // Capture URL params before the connect await: reads after an await are
    // untracked and this effect's re-run intent is the pre-await values.
    const currentNonce = nonce()
    const currentToken = token()

    const signMsg = async () => {
      if (!auth.isConnected) await auth.handleConnectWallet()
      if (auth.isConnected && currentNonce && currentToken) {
        void sign.signMessage()
        setMsgSent(true)
      }
    }

    if (!msgSent()) void signMsg()
  })

  return (
    <main class="container p-10 text-center" role="status" aria-live="polite">
      <Show
        when={sign.isError || sign.isSuccess}
        fallback={
          auth.isConnected
            ? 'Please sign message to verify address ownership'
            : 'Please connect your wallet'
        }
      >
        <Show when={sign.isError}>{'Error signing message'}</Show>
        <Show when={sign.isSuccess}>
          {'Successfully verified account! Please return to the Nifty League desktop app'}
        </Show>
      </Show>
    </main>
  )
}
