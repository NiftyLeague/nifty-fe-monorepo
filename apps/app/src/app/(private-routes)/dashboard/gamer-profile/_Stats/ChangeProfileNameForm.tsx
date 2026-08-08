'use client'

import { useState, useContext } from 'react'
import { toast } from 'sonner'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Button } from '@nl/ui/base/button'
import { Skeleton } from '@nl/ui/base/skeleton'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { Input } from '@nl/ui/custom/input'
import { Title } from '@nl/ui/custom/typography'

import { PROFILE_RENAME_API } from '@/constants/url'
import { DialogContext } from '@/components/dialog'

import { useProfileRenameFee } from '@/hooks/useGamerProfile'
import useAuth from '@/hooks/useAuth'

interface ChangeProfileNameFormProps {
  updateNewName: (name: string) => void
}
interface IFormInput {
  name: string
}

const validationSchema = yup.object({ name: yup.string().required() })

const ChangeProfileNameForm = ({ updateNewName }: ChangeProfileNameFormProps): React.ReactNode => {
  const [isLoadingRename, setLoadingRename] = useState(false)
  const { fee, loadingFee } = useProfileRenameFee()
  const [, setIsOpen] = useContext(DialogContext)
  const { authToken } = useAuth()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: { name: '' },
  })

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (!data.name || !authToken) {
      return
    }

    try {
      setLoadingRename(true)
      const response = await fetch(PROFILE_RENAME_API, {
        headers: { authorizationToken: authToken as string },
        method: 'POST',
        body: JSON.stringify({ name: data.name }),
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
    updateNewName(newName)
    setIsOpen(false)
    reset()
  }

  const renderFee = () => {
    if (loadingFee) {
      return <Skeleton className="h-[18.67px] w-full rounded" />
    }
    if (!loadingFee && fee) {
      return (
        <Title level={5}>There is a {fee} NFTL fee for changing your gamer profile username</Title>
      )
    }
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        {renderFee()}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <Input
                {...field}
                label="Enter the new name"
                error={!!errors.name}
                disabled={isLoadingRename}
              />
              {errors.name && <span className="text-xs text-error">{errors.name.message}</span>}
            </div>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoadingRename}>
          {isLoadingRename && <CircularProgress size="sm" />}
          Update
        </Button>
      </div>
    </form>
  )
}

export default ChangeProfileNameForm
