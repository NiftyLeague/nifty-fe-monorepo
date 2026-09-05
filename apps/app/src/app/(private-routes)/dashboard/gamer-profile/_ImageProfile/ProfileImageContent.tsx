'use client'

import { useContext, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Title } from '@nl/ui/custom/typography'
import { DialogContext } from '@/components/dialog'
import SectionSlider from '@/components/sections/SectionSlider'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import SearchRental from '@/app/(private-routes)/dashboard/rentals/SearchRental'
import EmptyState from '@/components/EmptyState'
import DegenInternalImage from './DegenInternalImage'

import type { DashboardDegen } from '@/types/degens'
import { UPDATE_PROFILE_AVATAR_API } from '@/constants/url'
import { filterBySearch } from '@/utils/search'
import useAuth from '@/hooks/useAuth'

export type ProfileImageContentProps = {
  degens: DashboardDegen[] | undefined
  onChangeAvatar: (degenId: string) => void
  avatarFee?: number
}

type ProfileImagePickerProps = {
  onSearch: (currentValue: string) => void
  onChangeAvatar: (degenId: string) => void
  degensInternal: DashboardDegen[]
  avatarFee?: number
}

const settings = { slidesToShow: 4, rows: 2, slidesPerRow: 1 }

const ProfileImagePicker = ({
  onSearch,
  onChangeAvatar,
  degensInternal,
  avatarFee,
}: ProfileImagePickerProps) => {
  const [, setIsOpen] = useContext(DialogContext)
  const { authToken } = useAuth()

  const handleSelectedDegen = async (degen: DashboardDegen) => {
    if (!degen?.id || !authToken) {
      return
    }

    try {
      const response = await fetch(UPDATE_PROFILE_AVATAR_API, {
        headers: { authorizationToken: authToken },
        method: 'POST',
        body: JSON.stringify({ avatar: degen?.id }),
      })
      if (!response.ok) {
        const errMsg = await response.text()
        toast.error(`Can not update the profile avatar: ${errMsg}`)
        return
      }
      toast.success('Update Profile Avatar Successful!')
      onChangeAvatar(degen?.id)
      setIsOpen(false)
    } catch (error) {
      toast.error(`Can not update the profile avatar: ${error}`)
    }
  }

  const renderDegenImage = (degen: DashboardDegen) => {
    if (degen?.url) {
      return <DegenInternalImage degen={degen} />
    }
    return <DegenImage tokenId={degen?.id} />
  }

  const renderDegens = () => {
    if (degensInternal.length > 0) {
      return degensInternal.map((degen) => (
        <div
          key={degen?.id}
          className="block cursor-pointer overflow-hidden [&_img]:transition-transform [&_img]:duration-500 hover:[&_img]:scale-[1.3]"
          onClick={() => handleSelectedDegen(degen)}
        >
          {renderDegenImage(degen)}
        </div>
      ))
    }
    return (
      <div className="flex flex-col items-center justify-center">
        <EmptyState message="No DEGENs found." />
      </div>
    )
  }

  return (
    <SectionSlider
      isSlider={degensInternal.length > 0}
      sliderSettingsOverride={settings}
      firstSection
      title={
        <div className="flex flex-1 flex-col gap-2">
          <Title level={2}>Choose a new profile degen</Title>
          <Title level={5}>
            There is a {avatarFee} NFTL fee for changing your gamer profile avatar
          </Title>
        </div>
      }
      actions={
        <SearchRental placeholder="Search degen by token # or name" handleSearch={onSearch} />
      }
    >
      {renderDegens()}
    </SectionSlider>
  )
}

export default function ProfileImageContent({
  degens,
  onChangeAvatar,
  avatarFee,
}: ProfileImageContentProps): React.ReactNode {
  const [searchValue, setSearchValue] = useState('')

  const degensInternal = useMemo(() => {
    if (!degens) return []
    return filterBySearch(degens, searchValue, (degen) => [degen?.id, degen?.name])
  }, [degens, searchValue])

  return (
    <ProfileImagePicker
      onSearch={setSearchValue}
      onChangeAvatar={onChangeAvatar}
      degensInternal={degensInternal}
      avatarFee={avatarFee}
    />
  )
}
