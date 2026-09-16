import { useContext, createMemo, createSignal, For, Show, type Accessor, type JSX } from 'solid-js'
import { toast } from 'solid-sonner'

import { Title } from '@nl/ui/custom/typography'
import { DialogContext } from '@/components/dialog'
import SectionSlider from '@/components/sections/SectionSlider'
import DegenImage from '@/components/cards/DegenCard/DegenImage'
import SearchRental from '@/pages/dashboard/rentals/SearchRental'
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
  degensInternal: Accessor<DashboardDegen[]>
  avatarFee?: number
}

const settings = { slidesToShow: 4, rows: 2, slidesPerRow: 1 }

const renderDegenImage = (degen: DashboardDegen) => {
  if (degen?.url) return <DegenInternalImage degen={degen} />
  return <DegenImage tokenId={degen?.id} />
}

const ProfileImagePicker = (props: ProfileImagePickerProps) => {
  const [, setIsOpen] = useContext(DialogContext)
  const auth = useAuth()

  const handleSelectedDegen = async (degen: DashboardDegen) => {
    if (!degen?.id || !auth.authToken) {
      return
    }

    try {
      const response = await fetch(UPDATE_PROFILE_AVATAR_API, {
        headers: { authorizationToken: auth.authToken },
        method: 'POST',
        body: JSON.stringify({ avatar: degen?.id }),
      })
      if (!response.ok) {
        const errMsg = await response.text()
        toast.error(`Can not update the profile avatar: ${errMsg}`)
        return
      }
      toast.success('Update Profile Avatar Successful!')
      props.onChangeAvatar(degen?.id)
      setIsOpen(false)
    } catch (error) {
      toast.error(`Can not update the profile avatar: ${error}`)
    }
  }

  return (
    <SectionSlider
      isSlider={props.degensInternal().length > 0}
      sliderSettingsOverride={settings}
      firstSection
      title={
        <div class="flex flex-1 flex-col gap-2">
          <Title level={2}>Choose a new profile degen</Title>
          <Title level={5}>
            There is a {props.avatarFee} NFTL fee for changing your gamer profile avatar
          </Title>
        </div>
      }
      actions={
        <SearchRental placeholder="Search degen by token # or name" handleSearch={props.onSearch} />
      }
    >
      <Show
        when={props.degensInternal().length > 0}
        fallback={
          <div class="flex flex-col items-center justify-center">
            <EmptyState message="No DEGENs found." />
          </div>
        }
      >
        <For each={props.degensInternal()}>
          {(degen) => (
            <div
              class="block cursor-pointer overflow-hidden [&_img]:transition-transform [&_img]:duration-500 hover:[&_img]:scale-130"
              onClick={() => void handleSelectedDegen(degen)}
            >
              {renderDegenImage(degen)}
            </div>
          )}
        </For>
      </Show>
    </SectionSlider>
  )
}

export default function ProfileImageContent(props: ProfileImageContentProps): JSX.Element {
  const [searchValue, setSearchValue] = createSignal('')

  const degensInternal = createMemo(() => {
    if (!props.degens) return []
    return filterBySearch(props.degens, searchValue(), (degen) => [degen?.id, degen?.name])
  })

  return (
    <ProfileImagePicker
      onSearch={setSearchValue}
      onChangeAvatar={props.onChangeAvatar}
      degensInternal={degensInternal}
      avatarFee={props.avatarFee}
    />
  )
}
