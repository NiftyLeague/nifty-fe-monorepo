'use client'

import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import type { RentalDataGrid } from '@/types/rentalDataGrid'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import { RENAME_RENTAL_API_URL } from '@/constants/url'
import { useDispatch } from '@/store/hooks'
import { openSnackbar } from '@/store/slices/snackbar'
import useAuth from '@/hooks/useAuth'

import { Button } from '@nl/ui/base/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@nl/ui/base/dialog'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Input } from '@nl/ui/custom/input'

interface IFormInput {
  name: string
}

const validationSchema = yup.object().shape({ name: yup.string().required('Name is required') })

interface Props {
  rental: RentalDataGrid
  updateRentalName: (name: string, id: string) => Promise<void>
}

const RenameRentalDialogContent = ({ rental, updateRentalName }: Props): React.ReactNode => {
  const { authToken } = useAuth()
  const dispatch = useDispatch()
  const [isLoadingRename, setIsLoadingRename] = useState(false)
  const { degenId, renter } = rental

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: { name: '' },
  })

  const onSubmit = async (data: IFormInput) => {
    if (!rental.id || !degenId || !data.name || !authToken) {
      return
    }

    try {
      setIsLoadingRename(true)
      const result = await fetch(`${RENAME_RENTAL_API_URL}?id=${encodeURIComponent(rental.id)}`, {
        method: 'POST',
        body: JSON.stringify({ name: data.name, degen_id: degenId }),
        headers: { authorizationToken: authToken } as Record<string, string>,
      })
      const res = await result.json()
      setIsLoadingRename(false)
      if (res.statusCode === 400) {
        setError('name', { type: 'custom', message: res.body })
        return
      }
      onRenameRentalSuccess(data.name)
    } catch (error) {
      setIsLoadingRename(false)
      setError('name', { type: 'custom', message: error as unknown as string })
    }
  }

  const onRenameRentalSuccess = (newName: string) => {
    dispatch(
      openSnackbar({
        open: true,
        message: 'Rename Rental Successful',
        variant: 'alert',
        alert: { color: 'success' },
        close: false,
      })
    )
    updateRentalName(newName, rental.id)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
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
        <Button
          onClick={() => reset()}
          disabled={isLoadingRename}
          className="w-full"
          variant="outline"
        >
          Cancel
        </Button>
        <Button type="submit" variant="default" className="w-full" disabled={isLoadingRename}>
          {isLoadingRename && <CircularProgress size="sm" />}
          Add Nickname
        </Button>
      </DialogFooter>
    </form>
  )
}

export default RenameRentalDialogContent
