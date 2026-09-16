import { useContext } from 'solid-js'
import { Edit } from 'lucide-solid'

import { Button } from '@nl/ui/base/button'
import DeferredComponent from '@nl/ui/custom/deferred-component'
import { Dialog, DialogContext, DialogTrigger, DialogContent } from '@/components/dialog'
import DeferredDialogLoading from '@/components/providers/DeferredDialogLoading'

import type { ProfileImageContentProps } from './ProfileImageContent'
import type { JSX } from 'solid-js'

const loadProfileImageContent = () => import('./ProfileImageContent')

function DeferredProfileImageContent(props: ProfileImageContentProps): JSX.Element {
  const [open] = useContext(DialogContext)

  return (
    <DeferredComponent
      enabled={open()}
      label="profile image picker"
      load={loadProfileImageContent}
      loadingFallback={<DeferredDialogLoading label="Loading profile image picker" />}
      props={props}
    />
  )
}

const ProfileImageDialog = (props: ProfileImageContentProps): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="icon"
          aria-label="edit"
          class="absolute left-2 top-2 cursor-pointer"
        >
          <Edit aria-hidden="true" absoluteStrokeWidth size={28} stroke-width={2.5} />
        </Button>
      </DialogTrigger>
      <DialogContent class="max-w-250">
        <DeferredProfileImageContent
          degens={props.degens}
          onChangeAvatar={props.onChangeAvatar}
          avatarFee={props.avatarFee}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ProfileImageDialog
