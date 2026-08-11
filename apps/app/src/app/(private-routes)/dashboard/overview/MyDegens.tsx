'use client'

/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import xor from 'lodash/xor'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent } from '@nl/ui/base/dialog'

import SectionSlider from '@/components/sections/SectionSlider'
import { DEGEN_BASE_API_URL, DEGEN_COLLECTION_URL, PROFILE_FAV_DEGENS_API } from '@/constants/url'
import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import EmptyState from '@/components/EmptyState'
import DeferredDegenDialog from '@/components/providers/DeferredDegenDialog'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import useFetch from '@/hooks/useFetch'
import { useProfileFavDegens } from '@/hooks/useGamerProfile'
import useAuth from '@/hooks/useAuth'
import type { Degen } from '@/types/degens'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'

const DegenCard = dynamic(
  () =>
    import('@/components/cards/DegenCard/DashboardDegenCard').then(
      (module) => module.DashboardDegenCardInView
    ),
  {
    ssr: false,
  }
)

const RenameDegenDialogContent = dynamic(
  () => import('@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent'),
  {
    ssr: false,
    loading: () => (
      <div className="sr-only" role="status" aria-live="polite" aria-busy="true">
        Loading rename form
      </div>
    ),
  }
)

const MyDegens = (): React.ReactNode => {
  const { authToken } = useAuth()
  const [selectedDegen, setSelectedDegen] = useState<Degen>()
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

  const { data: degensData } = useFetch<Degen[]>(
    `${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`
  )

  const filteredDegens = useMemo(() => {
    if (degensBalances?.length && degensData) {
      return degensBalances.map((degen) => degensData[Number(degen.id)]).filter(Boolean)
    }
    return []
  }, [degensBalances, degensData]) as Degen[]

  const settings = {
    slidesToShow: 4,
    adaptiveHeight: true, // disable if buggy behavior with degen cards
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 3 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 640, settings: { slidesToShow: 3 } },
    ],
  }

  const handleClickEditName = (degen: Degen): void => {
    setSelectedDegen(degen)
    setIsRenameDegenModalOpen(true)
  }

  const handleViewTraits = (degen: Degen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(false)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }

  const handleClaimDegen = (degen: Degen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(true)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }

  const handleRentDegen = (degen: Degen): void => {
    setSelectedDegen(degen)
    setIsRentDialog(true)
    setIsClaimDialog(false)
    setIsDegenModalOpen(true)
  }

  const handleClickFavorite = useCallback(
    async (degen: Degen) => {
      const newFavs = xor(
        favDegens?.filter((f) => f),
        [degen.id]
      )
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
          [...Array(8)].map(() => (
            <div className="w-full sm:w-[91.6667%]" key={uuidv4()}>
              <SkeletonDegenPlaceholder />
            </div>
          ))
        ) : filteredDegens.length && degensBalances.length ? (
          filteredDegens.map((degen) => (
            <div className="px-1" key={degen.id}>
              <DegenCard
                degen={degen}
                favs={favDegens}
                isDashboardDegen
                onClickClaim={() => handleClaimDegen(degen)}
                onClickDetail={() => handleViewTraits(degen)}
                onClickEditName={() => handleClickEditName(degen)}
                onClickFavorite={() => handleClickFavorite(degen)}
                onClickRent={() => handleRentDegen(degen)}
                size="small"
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <Link href={DEGEN_COLLECTION_URL} target="_blank" rel="noreferrer">
              <EmptyState
                message="No DEGENs found. Please check your address or go purchase a DEGEN if you have not done so already!"
                buttonText="Buy a DEGEN"
              />
            </Link>
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
          <RenameDegenDialogContent
            degen={selectedDegen}
            onSuccess={() => setIsRenameDegenModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MyDegens
