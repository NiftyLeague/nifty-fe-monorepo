import { mergeProps } from 'solid-js'

import DeferredComponent from '@nl/ui/custom/deferred-component'

import type { RentalDataGrid } from '@/types/rentalDataGrid'
import DeferredDialogLoading from './DeferredDialogLoading'

interface DeferredChangeNicknameDialogProps {
  open?: boolean
  rental: RentalDataGrid
  updateNickname: (name: string, id: string) => void
}

const loadChangeNicknameDialog = () => import('@/pages/dashboard/rentals/ChangeNicknameDialog')

export default function DeferredChangeNicknameDialog(props: DeferredChangeNicknameDialogProps) {
  const open = () => props.open ?? false
  return (
    <DeferredComponent
      enabled={open()}
      label="Rental nickname form"
      load={loadChangeNicknameDialog}
      loadingFallback={<DeferredDialogLoading label="Loading nickname form" />}
      props={mergeProps(props, {
        get open() {
          return open()
        },
      })}
    />
  )
}
