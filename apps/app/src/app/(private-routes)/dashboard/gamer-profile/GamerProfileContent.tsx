'use client'

import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import merge from 'lodash/merge'

import { Title } from '@nl/ui/custom/typography'

import { useGamerProfile, useProfileAvatarFee } from '@/hooks/useGamerProfile'
import useFetch from '@/hooks/useFetch'

import SectionSlider from '@/components/sections/SectionSlider'
import ImageProfile from './_ImageProfile'
import RightInfo from './_Stats/RightInfo'
import LeftInfo from './_Stats/LeftInfo'
import TopInfo from './_Stats/TopInfo'
import EmptyState from '@/components/EmptyState'
import BottomInfo from './_Stats/BottomInfo'

import { DEGEN_BASE_API_URL } from '@/constants/url'
import type { Degen } from '@/types/degens'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import { GamerProfileProvider } from '@/contexts/GamerProfileContext'

const GamerProfileContent = (): React.ReactNode => {
  const { profile, error, loadingProfile } = useGamerProfile()
  const { address } = useAccount()
  const { avatarsAndFee } = useProfileAvatarFee()
  const { data } = useFetch<Degen[]>(`${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`)

  const { comicsBalances, degenCount, degensBalances, itemsBalances } = useNFTsBalances()

  const filteredDegens: Degen[] = useMemo(() => {
    if (degensBalances?.length && data) {
      const mapDegens = degensBalances.map((degen) => data[Number(degen.id)]) as Degen[]
      return mapDegens
    }
    return []
  }, [degensBalances, data])

  const filteredComics = useMemo(
    () => comicsBalances.filter((comic) => comic.balance && comic.balance > 0),
    [comicsBalances]
  )

  const filteredItems = useMemo(
    () =>
      itemsBalances.filter(
        (item) => !item.title.includes('Key') && item.balance && item.balance > 0
      ),
    [itemsBalances]
  )
  const filteredKeys = useMemo(
    () =>
      itemsBalances.filter(
        (item) => item.title.includes('Key') && item.balance && item.balance > 0
      ),
    [itemsBalances]
  )

  const renderEmptyProfile = () => {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState message="You don't own any Gamer Profile yet." />
      </div>
    )
  }

  const renderTopProfile = () => {
    return (
      <div className="flex flex-wrap gap-6 rounded-md bg-muted p-8">
        <div className="w-full shrink-0 lg:w-[calc(29.1667%_-_12px)]">
          <ImageProfile
            avatar={profile?.avatar}
            avatarFee={avatarsAndFee?.price}
            degens={
              filteredDegens &&
              avatarsAndFee?.avatars &&
              merge(filteredDegens, avatarsAndFee?.avatars)
            }
          />
        </div>
        <div className="w-full min-w-0 lg:flex-1">
          {address && <TopInfo profile={profile} walletAddress={address} />}
          <hr className="mb-4" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Title level={3}>Nifty League Player Stats</Title>
            </div>
            <div className="flex flex-row gap-10">
              <LeftInfo data={profile?.stats?.total} />
              <RightInfo
                comicCount={filteredComics?.reduce((prev, cur) => prev + Number(cur?.balance), 0)}
                degenCount={degenCount}
                itemCount={filteredItems?.reduce((prev, cur) => prev + Number(cur?.balance), 0)}
                keyCount={filteredKeys?.reduce((prev, cur) => prev + Number(cur?.balance), 0)}
                rentalCount={filteredDegens.length - degenCount}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

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
        styles={{ root: { width: '100%' } }}
      >
        <BottomInfo
          nifty_smashers={profile?.stats?.nifty_smashers}
          wen_game={profile?.stats?.wen_game}
          crypto_winter={profile?.stats?.crypto_winter}
        />
      </SectionSlider>
    )
  }

  const renderGamerProfile = () => {
    return (
      <GamerProfileProvider>
        {renderTopProfile()}
        {renderBottomProfile()}
      </GamerProfileProvider>
    )
  }
  return (
    <div className="mb-6 flex flex-col gap-8">
      {error && !profile && !loadingProfile && renderEmptyProfile()}
      {(profile || loadingProfile) && renderGamerProfile()}
    </div>
  )
}

export default GamerProfileContent
