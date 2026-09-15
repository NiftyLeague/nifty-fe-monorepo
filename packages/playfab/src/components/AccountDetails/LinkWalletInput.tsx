import { Show, createSignal, onCleanup } from 'solid-js'
import { toast } from 'solid-sonner'

import { Icon } from '@nl/ui/base/icon'
import { Label } from '@nl/ui/base/label'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@nl/ui/base/input-group'

import { errorMsgHandler } from '../../utils/errorHandlers'
import { fetchJson } from '../../utils/fetchJson'
import { signMessage } from '../../utils/wallet'
import { useUserContext } from '../../hooks/useUserContext'

export default function LinkWalletInput(props: {
  index: number
  address?: string
  loading?: boolean
}) {
  const [error, setError] = createSignal<string | undefined>()
  const [deleteLoading, setDeleteLoading] = createSignal(false)
  const [copyLabel, setCopyLabel] = createSignal('Copy')
  let copyResetTimer: ReturnType<typeof setTimeout> | null = null
  const { refetchPlayer } = useUserContext()

  onCleanup(() => {
    if (copyResetTimer) clearTimeout(copyResetTimer)
  })

  const handleLinkWallet = async () => {
    setError(undefined)
    try {
      const result = await signMessage()
      if (result) {
        const { address: linkedAddress, nonce, signature } = result
        await fetchJson('/api/playfab/user/link-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: linkedAddress, signature, nonce }),
        })
        await refetchPlayer()
        toast.success('Wallet link success!')
      }
    } catch (e) {
      const msg = errorMsgHandler(e)
      setError(msg)
    }
  }

  const handleUnLinkWallet = async () => {
    setError(undefined)
    setDeleteLoading(true)
    if (props.address) {
      try {
        const [chain, wallet] = props.address.split(':')
        await fetchJson('/api/playfab/user/unlink-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: wallet, chain }),
        })
        await refetchPlayer()
        toast.success('Unlink wallet link success!')
      } catch (e) {
        const msg = errorMsgHandler(e)
        if (e instanceof Error) {
          setError(msg)
        } else {
          toast.error(msg)
        }
      }
    }
    setDeleteLoading(false)
  }

  const linked = () => Boolean(props.address && props.address.length > 1)
  const addressParsed = () => props.address?.split(':')[1] || ''
  const inputId = () => `link-wallet-${props.index}`
  const errorId = `${inputId()}-error`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(addressParsed())
      setCopyLabel('Copied')
      if (copyResetTimer) clearTimeout(copyResetTimer)
      copyResetTimer = setTimeout(() => setCopyLabel('Copy'), 3000)
    } catch {
      setCopyLabel('Failed to copy')
    }
  }

  return (
    <div class="grid gap-2">
      <Label for={`link-wallet-${props.index}`} class="sr-only">
        Link Wallet {props.index}
      </Label>
      <InputGroup class={!linked() ? '!bg-transparent' : undefined}>
        <InputGroupInput
          id={`link-wallet-${props.index}`}
          type="text"
          disabled
          value={addressParsed()}
          aria-invalid={Boolean(error())}
          aria-describedby={error() ? errorId : undefined}
        />
        <InputGroupAddon align="inline-end">
          <Show
            when={linked()}
            fallback={
              <InputGroupButton
                variant="dashed"
                size="sm"
                className="cursor-pointer disabled:cursor-progress"
                disabled={props.loading}
                onClick={handleLinkWallet}
              >
                <Icon name="link-2" aria-hidden="true" />
                Connect Wallet
              </InputGroupButton>
            }
          >
            <>
              <InputGroupButton
                variant="outline"
                size="sm"
                className="cursor-copy"
                onClick={handleCopy}
                aria-live="polite"
              >
                <Icon name="copy" aria-hidden="true" />
                {copyLabel()}
              </InputGroupButton>
              <InputGroupButton
                variant="destructive"
                size="sm"
                className="cursor-pointer disabled:cursor-not-allowed"
                disabled={deleteLoading()}
                onClick={handleUnLinkWallet}
              >
                Remove
              </InputGroupButton>
            </>
          </Show>
        </InputGroupAddon>
      </InputGroup>
      <Show when={error() && error()!.length > 0}>
        <p id={`${inputId()}-error`} role="alert" class="text-error text-xs font-bold">
          {error()}
        </p>
      </Show>
    </div>
  )
}
