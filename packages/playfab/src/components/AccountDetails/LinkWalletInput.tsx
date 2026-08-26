import { useEffect, useRef, useState } from 'react'
import { useSnackbar } from 'notistack'

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

export default function LinkWalletInput({
  index,
  address,
  loading,
}: {
  index: number
  address?: string
  loading?: boolean
}) {
  const [error, setError] = useState<string | undefined>()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy')
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { enqueueSnackbar } = useSnackbar()
  const { refetchPlayer } = useUserContext()

  useEffect(() => {
    return () => {
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current)
    }
  }, [])

  const handleLinkWallet = async () => {
    setError(undefined)
    try {
      const result = await signMessage()
      if (result) {
        const { address, nonce, signature } = result
        await fetchJson('/api/playfab/user/link-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, signature, nonce }),
        })
        await refetchPlayer()
        enqueueSnackbar('Wallet link success!', { variant: 'success' })
      }
    } catch (e) {
      const msg = errorMsgHandler(e)
      setError(msg)
    }
  }

  const handleUnLinkWallet = async () => {
    setError(undefined)
    setDeleteLoading(true)
    if (address) {
      try {
        const [chain, wallet] = address.split(':')
        await fetchJson('/api/playfab/user/unlink-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: wallet, chain }),
        })
        await refetchPlayer()
        enqueueSnackbar('Unlink wallet link success!', { variant: 'success' })
      } catch (e) {
        const msg = errorMsgHandler(e)
        if (e instanceof Error) {
          setError(msg)
        } else {
          enqueueSnackbar(msg, { variant: 'error' })
        }
      }
    }
    setDeleteLoading(false)
  }

  const linked = Boolean(address && address.length > 1)
  const addressParsed = address?.split(':')[1] || ''
  const inputId = `link-wallet-${index}`
  const errorId = `${inputId}-error`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(addressParsed)
      setCopyLabel('Copied')
      if (copyResetTimer.current) clearTimeout(copyResetTimer.current)
      copyResetTimer.current = setTimeout(() => setCopyLabel('Copy'), 3000)
    } catch {
      setCopyLabel('Failed to copy')
    }
  }

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor={inputId} className="sr-only">
          Link Wallet {index}
        </Label>
        <InputGroup className={!linked ? '!bg-transparent' : undefined}>
          <InputGroupInput
            id={inputId}
            type="text"
            disabled
            value={addressParsed}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
          <InputGroupAddon align="inline-end">
            {linked ? (
              <>
                <InputGroupButton
                  variant="outline"
                  size="sm"
                  className="cursor-copy"
                  onClick={handleCopy}
                  aria-live="polite"
                >
                  <Icon name="copy" aria-hidden="true" />
                  {copyLabel}
                </InputGroupButton>
                <InputGroupButton
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer disabled:cursor-not-allowed"
                  disabled={deleteLoading}
                  onClick={handleUnLinkWallet}
                >
                  Remove
                </InputGroupButton>
              </>
            ) : (
              <InputGroupButton
                variant="dashed"
                size="sm"
                className="cursor-pointer disabled:cursor-progress"
                disabled={loading}
                onClick={handleLinkWallet}
              >
                <Icon name="link-2" aria-hidden="true" />
                Connect Wallet
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
        {error && error.length > 0 ? (
          <p id={errorId} role="alert" className="text-error text-xs font-bold">
            {error}
          </p>
        ) : null}
      </div>
    </>
  )
}
