'use client'

import dynamic from 'next/dynamic'

import type { RentalDataGrid } from '@/types/rentalDataGrid'
import DeferredDialogLoading from './DeferredDialogLoading'

interface DeferredChangeNicknameDialogProps {
  rental: RentalDataGrid
  updateNickname: (name: string, id: string) => void
}

const DeferredChangeNicknameDialog = dynamic<DeferredChangeNicknameDialogProps>(
  () => import('@/app/(private-routes)/dashboard/rentals/ChangeNicknameDialog'),
  {
    ssr: false,
    loading: () => <DeferredDialogLoading label="Loading nickname form" />,
  }
)

export default DeferredChangeNicknameDialog
