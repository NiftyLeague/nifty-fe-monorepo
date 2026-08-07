'use client'

import { useContext, useState, useMemo } from 'react'
import { toast } from 'react-toastify'

import { Button } from '@nl/ui/base/button'
import { Icon } from '@nl/ui/base/icon'
import { Title } from '@nl/ui/custom/typography'
import { Dialog, DialogTrigger, DialogContent, DialogContext } from '@/components/dialog'
import SectionSlider from '@/components/sections/SectionSlider'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import SearchRental from '@/app/(private-routes)/dashboard/rentals/SearchRental'
import EmptyState from '@/components/EmptyState'
import DegenInternalImage from './DegenInternalImage'

import type { Degen } from '@/types/degens'
import { UPDATE_PROFILE_AVATAR_API } from '@/constants/url'
import useAuth from '@/hooks/useAuth'

type ProfileImageContentProps = {
  onSearch: (currentValue: string) => void
  onChangeAvatar: (degenId: string) => void
  degensInternal: Degen[]
  avatarFee?: number
}

const settings = { className: 'center', slidesToShow: 4, rows: 2, slidesPerRow: 1, swipe: false }

const ProfileImageContent = ({
  onSearch,
  onChangeAvatar,
  degensInternal,
  avatarFee,
}: ProfileImageContentProps) => {
  const [, setIsOpen] = useContext(DialogContext)
  const { authToken } = useAuth()

  const handleSelectedDegen = async (degen: Degen) => {
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
        toast.error(`Can not update the profile avatar: ${errMsg}`, { theme: 'dark' })
        return
      }
      toast.success('Update Profile Avatar Successful!', { theme: 'dark' })
      onChangeAvatar(degen?.id)
      setIsOpen(false)
    } catch (error) {
      toast.error(`Can not update the profile avatar: ${error}`, { theme: 'dark' })
    }
  }

  const renderDegenImage = (degen: Degen) => {
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

type ProfileImageDialogProps = {
  degens: Degen[] | undefined
  onChangeAvatar: (degenId: string) => void
  avatarFee?: number
}

const ProfileImageDialog = ({
  degens,
  onChangeAvatar,
  avatarFee,
}: ProfileImageDialogProps): React.ReactNode => {
  const [searchValue, setSearchValue] = useState('')

  const degensInternal = useMemo(() => {
    if (!degens) return []
    if (searchValue.trim() === '') return degens

    const lowercasedValue = searchValue.toLowerCase()
    return degens.filter(
      (degen) =>
        degen?.id.toLowerCase().includes(lowercasedValue) ||
        degen?.name.toLowerCase().includes(lowercasedValue)
    )
  }, [degens, searchValue])

  const handleSearch = (currentValue: string) => {
    setSearchValue(currentValue)
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant="ghost"
          size="icon"
          aria-label="edit"
          className="absolute left-2 top-2 cursor-pointer"
        >
          <Icon name="edit" size="xl" strokeWidth={2.5} />
        </Button>
      </DialogTrigger>
      <DialogContent sx={{ maxWidth: '1000px' }}>
        <ProfileImageContent
          onSearch={handleSearch}
          onChangeAvatar={onChangeAvatar}
          degensInternal={degensInternal}
          avatarFee={avatarFee}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ProfileImageDialog
