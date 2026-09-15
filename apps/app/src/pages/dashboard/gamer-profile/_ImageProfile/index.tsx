'use client'

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
      return <DeferredSkeleton class="h-[320px] w-full rounded" />
    }
    if (!degenSelected()) {
      return (
        <NativeImage
          src="/img/degens/unavailable-image.webp"
          alt="no avatar"
          width={730}
          height={800}
          class="mx-auto max-w-[500px] object-cover"
          style={{ width: '100%', height: 'auto' }}
        />
      )
    }
    return <DegenImage tokenId={degenSelected()!} sx={{ 'max-width': '500px' }} />
  }

  return (
    <div class="relative [&_img]:rounded-[var(--radius-default)]">
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
