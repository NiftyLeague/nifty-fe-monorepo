'use client'

import dynamic from '@/runtime/dynamic'

import type { DashboardDegen } from '@/types/degens'
import DeferredDialogLoading from './DeferredDialogLoading'

interface DeferredProfileImageDialogProps {
  degens: DashboardDegen[] | undefined
  onChangeAvatar: (degenId: string) => void
  avatarFee?: number
}

const DeferredProfileImageDialog = dynamic<DeferredProfileImageDialogProps>(
  () => import('@/pages/dashboard/gamer-profile/_ImageProfile/ProfileImageDialog'),
  {
    ssr: false,
    loading: () => <DeferredDialogLoading label="Loading profile image picker" />,
  }
)

export default DeferredProfileImageDialog
