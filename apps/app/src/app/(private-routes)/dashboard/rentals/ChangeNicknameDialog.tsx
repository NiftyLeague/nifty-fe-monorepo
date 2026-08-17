'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
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
interface IFormInput {
  name: string
}

const ChangeNicknameDialog = ({ rental, updateNickname }: Props): React.ReactNode => {
  const { authToken } = useAuth()
  const [nicknames, setNicknames] = useLocalStorage<{ [address: string]: string }>(
    'player-nicknames',
    {}
  )
  const [isLoadingRename, setLoadingRename] = useState(false)
  const { rentalId, degenId, renter, playerAddress } = rental

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: 'onChange',
    defaultValues: { name: '' },
  })

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (!rentalId || !degenId || !data.name || !authToken) {
      return
    }
    setLoadingRename(true)
    setNicknames({ ...nicknames, [playerAddress as string]: data.name })
    setLoadingRename(false)
    onRenameRentalSuccess(data.name)
  }

  const onRenameRentalSuccess = (newName: string) => {
    toast.success('Rename Rental Successful!')
    updateNickname(newName, rentalId)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <DialogHeader>
        <DialogTitle className="text-center">Assign a Nickname</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {degenId && <DegenImage tokenId={degenId} />}
          <p className="text-center text-xs text-muted-foreground">Recruit</p>
          <p className="text-center text-xs text-muted-foreground">{renter}</p>
        </div>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Nickname is required' }}
          render={({ field }) => (
            <div className="grid gap-2">
              <Label
                htmlFor="recruit-wallet-nickname"
                className={errors.name ? 'text-destructive' : undefined}
              >
                Enter nickname for recruit wallet
              </Label>
              <div className="relative">
                <Input
                  {...field}
                  id="recruit-wallet-nickname"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'recruit-wallet-nickname-error' : undefined}
                  className={errors.name ? 'pr-10' : undefined}
                  disabled={isLoadingRename}
                />
                {errors.name && (
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-destructive">
                    <AlertCircle aria-hidden="true" size={18} />
                  </span>
                )}
              </div>
            </div>
          )}
        />
        {errors.name && (
          <p id="recruit-wallet-nickname-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>
      <DialogFooter>
        <Button type="submit" variant="default" className="w-full" disabled={isLoadingRename}>
          {isLoadingRename && <CircularProgress size="sm" />}
          Add Nickname
        </Button>
      </DialogFooter>
    </form>
  )
}

export default ChangeNicknameDialog
