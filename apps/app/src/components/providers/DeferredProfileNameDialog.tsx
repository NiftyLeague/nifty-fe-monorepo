'use client'

import dynamic from 'next/dynamic'

import DeferredDialogLoading from './DeferredDialogLoading'

interface DeferredProfileNameDialogProps {
  handleUpdateNewName: (newName: string) => void
}

const DeferredProfileNameDialog = dynamic<DeferredProfileNameDialogProps>(
  () => import('@/app/(private-routes)/dashboard/gamer-profile/_Stats/ChangeProfileNameDialog'),
  {
    ssr: false,
    loading: () => <DeferredDialogLoading label="Loading profile name form" />,
  }
)

export default DeferredProfileNameDialog
