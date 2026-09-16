import { createMemo, Show, type JSX } from 'solid-js'
import NativeImage from '@nl/ui/custom/native-image'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

import DegenImage from '@/components/cards/DegenCard/DegenImage'
import DeferredProfileImageDialog from '@/components/providers/DeferredProfileImageDialog'
import { useGamerProfileContext } from '@/hooks/useGamerProfile'

import type { DashboardDegen } from '@/types/degens'
import type { ProfileAvatar } from '@/types/account'

interface ImageProfileProps {
  degens: DashboardDegen[] | undefined
  avatar?: ProfileAvatar
  avatarFee?: number
}

const ImageProfile = (props: ImageProfileProps): JSX.Element => {
  const profile = useGamerProfileContext()
  const degenSelected = createMemo(() => props.avatar?.id ?? props.degens?.[0]?.id)

  const handleChangeAvatar = () => {
    void profile.fetchUserProfile?.()
  }

  const renderImage = () => {
    if (profile.isLoadingDegens) {
      return <DeferredSkeleton class="h-80 w-full rounded" />
    }
    if (!degenSelected()) {
      return (
        <NativeImage
          src="https://cdn.niftyleague.com/degens/site/unavailable-image.webp"
          alt="no avatar"
          width={730}
          height={800}
          class="mx-auto w-full max-w-125 h-auto object-cover"
        />
      )
    }
    return <DegenImage tokenId={degenSelected()!} class="max-w-125" />
  }

  return (
    <div class="relative [&_img]:rounded-(--radius-default)">
      {renderImage()}
      <Show when={props.degens && props.degens.length > 0}>
        <DeferredProfileImageDialog
          onChangeAvatar={handleChangeAvatar}
          degens={props.degens}
          avatarFee={props.avatarFee}
        />
      </Show>
    </div>
  )
}

export default ImageProfile
