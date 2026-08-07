'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { Controller, SubmitHandler, useForm, Resolver } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import type { RentalDataGrid } from '@/types/rentalDataGrid'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import useAuth from '@/hooks/useAuth'
import useLocalStorage from '@/hooks/useLocalStorage'

import { Button } from '@nl/ui/base/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@nl/ui/base/dialog'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Input } from '@nl/ui/custom/input'

interface Props {
  rental: RentalDataGrid
  updateNickname: (name: string, id: string) => void
}
interface IFormInput {
  name: string
  isCheckedTerm: boolean
}

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  isCheckedTerm: yup.boolean().required().oneOf([true]),
}) satisfies yup.ObjectSchema<IFormInput>

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
    resolver: yupResolver(validationSchema) as Resolver<IFormInput>,
    mode: 'onChange',
    defaultValues: { name: '', isCheckedTerm: false },
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
    toast.success('Rename Rental Successful!', { theme: 'dark' })
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
          render={({ field }) => (
            <Input
              {...field}
              label="Enter nickname for recruit wallet"
              error={!!errors.name}
              aria-invalid={!!errors.name}
              disabled={isLoadingRename}
            />
          )}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
