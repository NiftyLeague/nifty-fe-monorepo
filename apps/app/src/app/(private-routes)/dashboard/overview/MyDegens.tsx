'use client'

/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent } from '@nl/ui/base/dialog'

import SectionSlider from '@/components/sections/SectionSlider'
import {
  DEGEN_COLLECTION_URL,
  PROFILE_FAV_DEGENS_API,
  getPublicDegensByIdsUrl,
} from '@/constants/url'
import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import EmptyState from '@/components/EmptyState'
import DeferredDegenDialog from '@/components/providers/DeferredDegenDialog'
import DeferredRenameDegenDialog from '@/components/providers/DeferredRenameDegenDialog'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import useFetch from '@/hooks/useFetch'
import { useProfileFavDegens } from '@/hooks/useGamerProfile'
import useAuth from '@/hooks/useAuth'
import type { DashboardDegen } from '@/types/degens'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'
import { toggleValue } from '@/utils/collections'

const DegenCard = dynamic(
  () =>
    import('@/components/cards/DegenCard/DashboardDegenCard').then(
      (module) => module.DashboardDegenCardInView
    ),
  {
    ssr: false,
  }
)

const MyDegens = (): React.ReactNode => {
  const { authToken } = useAuth()
  const [selectedDegen, setSelectedDegen] = useState<DashboardDegen>()
  const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = useState<boolean>(false)
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false)
  const [isClaimDialog, setIsClaimDialog] = useState<boolean>(false)
  const [isRentDialog, setIsRentDialog] = useState<boolean>(false)
  const router = useRouter()
  const { favs: favsData } = useProfileFavDegens()
  const { favDegens, setFavDegens } = useLocalStorageContext()

  useEffect(() => {
    if (favsData && favsData !== 'null') {
      setFavDegens(favsData.split(','))
    }
  }, [favsData, setFavDegens])

  const { loadingDegens, degensBalances } = useNFTsBalances()

  const degenIds = useMemo(
    () => [...new Set(degensBalances.map((degen) => String(degen.id)))],
    [degensBalances]
  )
  const degensDataUrl = degenIds.length ? getPublicDegensByIdsUrl(degenIds) : undefined
  const { data: degensData } = useFetch<DashboardDegen[]>(degensDataUrl, {
    enabled: Boolean(degensDataUrl),
    sharedCache: true,
  })

  const filteredDegens = useMemo(() => {
    if (!degensBalances.length || !degensData) return []

    const degensById = new Map(degensData.map((degen) => [degen.id, degen]))
    return degensBalances
      .map((degen) => degensById.get(String(degen.id)))
      .filter((degen): degen is DashboardDegen => Boolean(degen))
  }, [degensBalances, degensData])

  const settings = {
    slidesToShow: 4,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 3 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 640, settings: { slidesToShow: 3 } },
    ],
  }

  const handleClickEditName = (degen: DashboardDegen): void => {
    setSelectedDegen(degen)
    setIsRenameDegenModalOpen(true)
  }

  const handleViewTraits = (degen: DashboardDegen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(false)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }

  const handleClaimDegen = (degen: DashboardDegen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(true)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }

  const handleClickFavorite = useCallback(
    async (degen: DashboardDegen) => {
      const newFavs = toggleValue(favDegens?.filter((f) => f) ?? [], degen.id)
      await fetch(`${PROFILE_FAV_DEGENS_API}`, {
        method: 'POST',
        body: JSON.stringify({ favorites: newFavs.toString() }),
        headers: { authorizationToken: authToken } as Record<string, string>,
      })
      setFavDegens(newFavs)
    },
    [authToken, favDegens, setFavDegens]
  )

  return (
    <>
      <SectionSlider
        isSlider={filteredDegens.length > 0 && degensBalances.length > 0}
        firstSection
        title="My DEGENs"
        variant="h3"
        sliderSettingsOverride={settings}
        actions={
          <Button variant="outline" onClick={() => router.push('/dashboard/degens')}>
            View All DEGENs
          </Button>
        }
        styles={{ mainRow: { minHeight: 300, maxHeight: 330, overflow: 'hidden' } }}
      >
        {loadingDegens ? (
          [...Array(8)].map((_, index) => (
            <div className="w-full sm:w-[91.6667%]" key={`my-degen-skeleton-${index}`}>
              <SkeletonDegenPlaceholder />
            </div>
          ))
        ) : filteredDegens.length && degensBalances.length ? (
          filteredDegens.map((degen) => (
            <div className="px-1" key={degen.id}>
              <DegenCard
                degen={degen}
                deferAnimatedMedia
                favs={favDegens}
                isDashboardDegen
                onClickClaim={() => handleClaimDegen(degen)}
                onClickDetail={() => handleViewTraits(degen)}
                onClickEditName={() => handleClickEditName(degen)}
                onClickFavorite={() => handleClickFavorite(degen)}
                size="small"
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <a href={DEGEN_COLLECTION_URL} target="_blank" rel="noreferrer">
              <EmptyState
                message="No DEGENs found. Please check your address or go purchase a DEGEN if you have not done so already!"
                buttonText="Buy a DEGEN"
              />
            </a>
          </div>
        )}
      </SectionSlider>
      {isDegenModalOpen && (
        <DeferredDegenDialog
          open
          degen={selectedDegen}
          isClaim={isClaimDialog}
          isRent={isRentDialog}
          setIsClaim={setIsClaimDialog}
          setIsRent={setIsRentDialog}
          onClose={() => setIsDegenModalOpen(false)}
        />
      )}
      <Dialog
        open={isRenameDegenModalOpen}
        onOpenChange={(open) => !open && setIsRenameDegenModalOpen(false)}
      >
        <DialogContent showCloseButton={false}>
          <DeferredRenameDegenDialog
            open={isRenameDegenModalOpen}
            degen={selectedDegen}
            onSuccess={() => setIsRenameDegenModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MyDegens
