'use client'

import { useContext } from 'react'
import { Edit } from 'lucide-react'

import { Button } from '@nl/ui/base/button'
import DeferredComponent from '@nl/ui/custom/deferred-component'
import { Dialog, DialogContext, DialogTrigger, DialogContent } from '@/components/dialog'
import DeferredDialogLoading from '@/components/providers/DeferredDialogLoading'

import type { ProfileImageContentProps } from './ProfileImageContent'

const loadProfileImageContent = () => import('./ProfileImageContent')

function DeferredProfileImageContent(props: ProfileImageContentProps): React.ReactNode {
  const [open] = useContext(DialogContext)

  return (
    <DeferredComponent
      enabled={open}
      label="profile image picker"
      load={loadProfileImageContent}
      loadingFallback={<DeferredDialogLoading label="Loading profile image picker" />}
      props={props}
    />
  )
}

const ProfileImageDialog = ({
  degens,
  onChangeAvatar,
  avatarFee,
}: ProfileImageContentProps): React.ReactNode => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="icon"
          aria-label="edit"
          className="absolute left-2 top-2 cursor-pointer"
        >
          <Edit aria-hidden="true" absoluteStrokeWidth size={28} strokeWidth={2.5} />
        </Button>
      </DialogTrigger>
      <DialogContent sx={{ maxWidth: '1000px' }}>
        <DeferredProfileImageContent
          degens={degens}
          onChangeAvatar={onChangeAvatar}
          avatarFee={avatarFee}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ProfileImageDialog
