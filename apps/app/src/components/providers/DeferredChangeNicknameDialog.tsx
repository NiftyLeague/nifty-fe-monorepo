'use client'

import DeferredComponent from '@nl/ui/custom/deferred-component'

import type { RentalDataGrid } from '@/types/rentalDataGrid'
import DeferredDialogLoading from './DeferredDialogLoading'

interface DeferredChangeNicknameDialogProps {
  open?: boolean
  rental: RentalDataGrid
  updateNickname: (name: string, id: string) => void
}

const loadChangeNicknameDialog = () =>
  import('@/app/(private-routes)/dashboard/rentals/ChangeNicknameDialog')

export default function DeferredChangeNicknameDialog({
  open = false,
  ...props
}: DeferredChangeNicknameDialogProps) {
  return (
    <DeferredComponent
      enabled={open}
      label="Rental nickname form"
      load={loadChangeNicknameDialog}
      loadingFallback={<DeferredDialogLoading label="Loading nickname form" />}
      props={props}
    />
  )
}
