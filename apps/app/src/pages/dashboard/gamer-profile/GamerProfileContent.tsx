import { createMemo, Show, type JSX } from 'solid-js'
import { useAccount } from '@/runtime/wagmi'

import { Title } from '@nl/ui/custom/typography'
import { Separator } from '@nl/ui/base/separator'

import { useGamerProfile, useProfileAvatarFee } from '@/hooks/useGamerProfile'
import { usePublicDegensByIds } from '@/hooks/queries/usePublicDegens'

import SectionSlider from '@/components/sections/SectionSlider'
import ImageProfile from './_ImageProfile'
import RightInfo from './_Stats/RightInfo'
import LeftInfo from './_Stats/LeftInfo'
import TopInfo from './_Stats/TopInfo'
import EmptyState from '@/components/EmptyState'
import BottomInfo from './_Stats/BottomInfo'

import type { DashboardDegen } from '@/types/degens'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import { GamerProfileProvider } from '@/contexts/GamerProfileContext'

const renderEmptyProfile = () => (
  <div class="flex h-full items-center justify-center">
    <EmptyState message="You don't own any Gamer Profile yet." />
  </div>
)

const GamerProfileContent = (): JSX.Element => {
  const gamerProfile = useGamerProfile()
  const account = useAccount()
  const avatarFee = useProfileAvatarFee()
  const profileAvatars = () => avatarFee.avatarsAndFee?.avatars
  const nfts = useNFTsBalances()
  const degenIds = createMemo(() => [
    ...new Set(nfts.degensBalances.map((degen) => String(degen.id))),
  ])
  const publicDegensQuery = usePublicDegensByIds(degenIds)

  const filteredDegens = createMemo(() => {
    const data = publicDegensQuery.data
    if (!nfts.degensBalances.length || !data) return []

    const degensById = new Map(data.map((degen) => [degen.id, degen]))
    return nfts.degensBalances
      .map((degen) => degensById.get(String(degen.id)))
      .filter((degen): degen is DashboardDegen => Boolean(degen))
  })

  const filteredComics = createMemo(() =>
    nfts.comicsBalances.filter((comic) => comic.balance && comic.balance > 0)
  )

  const filteredItems = createMemo(() =>
    nfts.itemsBalances.filter(
      (item) => !item.title.includes('Key') && item.balance && item.balance > 0
    )
  )
  const filteredKeys = createMemo(() =>
    nfts.itemsBalances.filter(
      (item) => item.title.includes('Key') && item.balance && item.balance > 0
    )
  )

  const profileDegens = createMemo(() => {
    const avatars = profileAvatars()
    if (!avatars) return filteredDegens()

    return filteredDegens().map((degen, index) => ({
      ...degen,
      ...avatars[index],
    }))
  })

  const renderTopProfile = () => (
    <div class="flex flex-wrap gap-6 rounded-md bg-muted p-8">
      <div class="w-full shrink-0 lg:w-[calc(29.1667%_-_12px)]">
        <ImageProfile
          avatar={gamerProfile.profile?.avatar}
          avatarFee={avatarFee.avatarsAndFee?.price}
          degens={profileDegens()}
        />
      </div>
      <div class="w-full min-w-0 lg:flex-1">
        <Show when={account.address}>
          {(address) => <TopInfo profile={gamerProfile.profile} walletAddress={address()} />}
        </Show>
        <Separator class="mb-4" />
        <div class="flex flex-col gap-4">
          <div class="flex flex-col">
            <Title level={3}>Nifty League Player Stats</Title>
          </div>
          <div class="flex flex-row gap-10">
            <LeftInfo data={gamerProfile.profile?.stats?.total} />
            <RightInfo
              comicCount={filteredComics().reduce((prev, cur) => prev + Number(cur?.balance), 0)}
              degenCount={nfts.degenCount}
              itemCount={filteredItems().reduce((prev, cur) => prev + Number(cur?.balance), 0)}
              keyCount={filteredKeys().reduce((prev, cur) => prev + Number(cur?.balance), 0)}
              rentalCount={filteredDegens().length - nfts.degenCount}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderBottomProfile = () => {
    const sliderSettingsOverride = {
      slidesToShow: 3,
      responsive: [
        { breakpoint: 1536, settings: { slidesToShow: 3 } },
        { breakpoint: 1280, settings: { slidesToShow: 3 } },
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } },
        { breakpoint: 640, settings: { slidesToShow: 1 } },
      ],
    }
    return (
      <SectionSlider
        firstSection
        variant="h3"
        title="Player Stats by Web3 Game"
        isSlider={false}
        sliderSettingsOverride={sliderSettingsOverride}
        class="w-full"
      >
        <BottomInfo
          nifty_smashers={gamerProfile.profile?.stats?.nifty_smashers}
          wen_game={gamerProfile.profile?.stats?.wen_game}
          crypto_winter={gamerProfile.profile?.stats?.crypto_winter}
        />
      </SectionSlider>
    )
  }

  return (
    <div class="mb-6 flex flex-col gap-8">
      <Show when={gamerProfile.error && !gamerProfile.profile && !gamerProfile.loadingProfile}>
        {renderEmptyProfile()}
      </Show>
      <Show when={gamerProfile.profile || gamerProfile.loadingProfile}>
        <GamerProfileProvider>
          {renderTopProfile()}
          {renderBottomProfile()}
        </GamerProfileProvider>
      </Show>
    </div>
  )
}

export default GamerProfileContent
