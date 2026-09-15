'use client'

import { createSignal, Show, type JSX } from 'solid-js'
import { AlertCircle } from 'lucide-solid'
import { toast } from 'solid-sonner'
import type { RentalDataGrid } from '@/types/rentalDataGrid'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import useAuth from '@/hooks/useAuth'
import useLocalStorage from '@/hooks/useLocalStorage'

import { Button } from '@nl/ui/base/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@nl/ui/base/dialog'
import { Input } from '@nl/ui/base/input'
import { Label } from '@nl/ui/base/label'
import { CircularProgress } from '@nl/ui/custom/circular-progress'

interface Props {
  rental: RentalDataGrid
  updateNickname: (name: string, id: string) => void
}

const ChangeNicknameDialog = (props: Props): JSX.Element => {
  const auth = useAuth()
  const [nicknames, setNicknames] = useLocalStorage<{ [address: string]: string }>(
    'player-nicknames',
    {}
  )
  const [isLoadingRename, setLoadingRename] = createSignal(false)
  const [name, setName] = createSignal('')
  const [nameError, setNameError] = createSignal('')
  const rental = () => props.rental

  const onSubmit = async () => {
    const { rentalId, degenId, playerAddress } = rental()
    if (!name().trim()) {
      setNameError('Nickname is required')
      return
    }
    if (!rentalId || !degenId || !auth.authToken) {
      return
    }
    setLoadingRename(true)
    setNicknames({ ...nicknames(), [playerAddress as string]: name() })
    setLoadingRename(false)
    onRenameRentalSuccess(name())
  }

  const onRenameRentalSuccess = (newName: string) => {
    toast.success('Rename Rental Successful!')
    props.updateNickname(newName, rental().rentalId)
    setName('')
    setNameError('')
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void onSubmit()
      }}
      class="w-full"
    >
      <DialogHeader>
        <DialogTitle class="text-center">Assign a Nickname</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <Show when={rental().degenId}>{(degenId) => <DegenImage tokenId={degenId()} />}</Show>
          <p class="text-center text-xs text-muted-foreground">Recruit</p>
          <p class="text-center text-xs text-muted-foreground">{rental().renter}</p>
        </div>
        <div class="grid gap-2">
          <Label for="recruit-wallet-nickname" class={nameError() ? 'text-destructive' : undefined}>
            Enter nickname for recruit wallet
          </Label>
          <div class="relative">
            <Input
              id="recruit-wallet-nickname"
              value={name()}
              onInput={(event) => {
                setName(event.currentTarget.value)
                setNameError('')
              }}
              aria-invalid={!!nameError()}
              aria-describedby={nameError() ? 'recruit-wallet-nickname-error' : undefined}
              class={nameError() ? 'pr-10' : undefined}
              disabled={isLoadingRename()}
            />
            <Show when={nameError()}>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-destructive">
                <AlertCircle aria-hidden="true" size={18} />
              </span>
            </Show>
          </div>
        </div>
        <Show when={nameError()}>
          {(msg) => (
            <p id="recruit-wallet-nickname-error" class="text-sm text-destructive">
              {msg()}
            </p>
          )}
        </Show>
      </div>
      <DialogFooter>
        <Button type="submit" variant="default" class="w-full" disabled={isLoadingRename()}>
          <Show when={isLoadingRename()}>
            <CircularProgress size="sm" />
          </Show>
          Add Nickname
        </Button>
      </DialogFooter>
    </form>
  )
}

export default ChangeNicknameDialog
