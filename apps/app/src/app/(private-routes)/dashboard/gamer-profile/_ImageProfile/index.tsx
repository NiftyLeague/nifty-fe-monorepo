'use client'

import { useMemo } from 'react'
import { Skeleton } from '@nl/ui/base/skeleton'

import DegenImage from '@/components/cards/DegenCard/DegenImage'
import { useGamerProfileContext } from '@/hooks/useGamerProfile'
import ProfileImageDialog from './ProfileImageDialog'

import type { Degen } from '@/types/degens'
import type { ProfileAvatar } from '@/types/account'

interface ImageProfileProps {
  degens: Degen[] | undefined
  avatar?: ProfileAvatar
  avatarFee?: number
}

const ImageProfile = ({ degens, avatar, avatarFee }: ImageProfileProps): React.ReactNode => {
  const { isLoadingDegens, fetchUserProfile } = useGamerProfileContext()
  const degenSelected = useMemo(() => avatar?.id ?? degens?.[0]?.id, [avatar, degens])

  const handleChangeAvatar = () => {
    fetchUserProfile?.()
  }

  const renderImage = () => {
    if (isLoadingDegens) {
      return <Skeleton className="h-[320px] w-full rounded" />
    } else {
      if (!degenSelected) {
        return (
          <img
            src="/img/degens/unavailable-image.webp"
            alt="no avatar"
            className="mx-auto max-w-[500px] object-cover"
          />
        )
      }
      return <DegenImage tokenId={degenSelected} sx={{ maxWidth: '500px' }} />
    }
  }

  return (
    <>
      <div className="relative [&_img]:rounded-[var(--radius-default)]">
        {renderImage()}
        {degens && degens.length > 0 && (
          <ProfileImageDialog
            onChangeAvatar={handleChangeAvatar}
            degens={degens}
            avatarFee={avatarFee}
          />
        )}
      </div>
    </>
  )
}

export default ImageProfile
