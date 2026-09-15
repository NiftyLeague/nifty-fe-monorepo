'use client'

import { createSignal, Show, useContext, type JSX } from 'solid-js'
import { AlertCircle } from 'lucide-solid'
import { toast } from 'solid-sonner'

import { Button } from '@nl/ui/base/button'
import { Input } from '@nl/ui/base/input'
import { Label } from '@nl/ui/base/label'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Title } from '@nl/ui/custom/typography'

import { PROFILE_RENAME_API } from '@/constants/url'
import { DialogContext } from '@/components/dialog'

import { useProfileRenameFee } from '@/hooks/useGamerProfile'
import useAuth from '@/hooks/useAuth'

interface ChangeProfileNameFormProps {
  updateNewName: (name: string) => void
}

const ChangeProfileNameForm = (props: ChangeProfileNameFormProps): JSX.Element => {
  const [isLoadingRename, setLoadingRename] = createSignal(false)
  const renameFee = useProfileRenameFee()
  const [, setIsOpen] = useContext(DialogContext)
  const auth = useAuth()
  const [name, setName] = createSignal('')
  const [nameError, setNameError] = createSignal('')

  const onSubmit = async () => {
    if (!name().trim()) {
      setNameError('Name is required')
      return
    }
    if (!auth.authToken) {
      return
    }

    try {
      setLoadingRename(true)
      const response = await fetch(PROFILE_RENAME_API, {
        headers: { authorizationToken: auth.authToken as string },
        method: 'POST',
        body: JSON.stringify({ name: name() }),
      })
      if (!response.ok) {
        const errMsg = await response.text()
        setLoadingRename(false)
        toast.error(`Can not update the new name: ${errMsg}`)
        return
      }
      const res = await response.json()
      onRenameRentalSuccess(res?.name_cased)
    } catch (error) {
      setLoadingRename(false)
      toast.error(`Can not update the new name: ${error}`)
    }
  }

  const onRenameRentalSuccess = (newName: string) => {
    setLoadingRename(false)
    toast.success('Rename Profile Successful!')
    props.updateNewName(newName)
    setIsOpen(false)
    setName('')
    setNameError('')
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void onSubmit()
      }}
    >
      <div class="flex flex-col gap-4">
        <Show
          when={!renameFee.loadingFee}
          fallback={<DeferredSkeleton class="h-[18.67px] w-full rounded" />}
        >
          <Show when={renameFee.fee}>
            {(fee) => (
              <Title level={5}>
                There is a {fee()} NFTL fee for changing your gamer profile username
              </Title>
            )}
          </Show>
        </Show>
        <div class="flex flex-col gap-1">
          <div class="grid gap-2">
            <Label for="gamer-profile-name" class={nameError() ? 'text-destructive' : undefined}>
              Enter the new name
            </Label>
            <div class="relative">
              <Input
                id="gamer-profile-name"
                value={name()}
                onInput={(event) => {
                  setName(event.currentTarget.value)
                  setNameError('')
                }}
                aria-invalid={!!nameError()}
                aria-describedby={nameError() ? 'gamer-profile-name-error' : undefined}
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
              <span id="gamer-profile-name-error" class="text-xs text-error">
                {msg()}
              </span>
            )}
          </Show>
        </div>
        <Button type="submit" class="w-full" disabled={isLoadingRename()}>
          <Show when={isLoadingRename()}>
            <CircularProgress size="sm" />
          </Show>
          Update
        </Button>
      </div>
    </form>
  )
}

export default ChangeProfileNameForm
