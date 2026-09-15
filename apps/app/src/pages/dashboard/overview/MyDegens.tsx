'use client'

import { createMemo, createSignal } from 'solid-js'
import { useRouter } from '@/runtime/navigation'
import dynamic from '@/runtime/dynamic'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent } from '@nl/ui/base/dialog'

import SectionSlider from '@/components/sections/SectionSlider'
import { DEGEN_COLLECTION_URL } from '@/constants/url'
import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import type { DegenCardProps } from '@/components/cards/DegenCard'
import EmptyState from '@/components/EmptyState'
import DeferredDegenDialog from '@/components/providers/DeferredDegenDialog'
import DeferredRenameDegenDialog from '@/components/providers/DeferredRenameDegenDialog'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import { usePublicDegensByIds } from '@/hooks/queries/usePublicDegens'
import useFavoriteDegens from '@/hooks/useFavoriteDegens'
import type { DashboardDegen } from '@/types/degens'

const DegenCard = dynamic<DegenCardProps<DashboardDegen>>(
  () =>
    import('@/components/cards/DegenCard/DashboardDegenCard').then(
      (module) => module.DashboardDegenCardInView
    ),
  {
    ssr: false,
  }
)

const MyDegens = (): JSX.Element => {
  const [selectedDegen, setSelectedDegen] = createSignal<DashboardDegen>()
  const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = createSignal<boolean>(false)
  const [isDegenModalOpen, setIsDegenModalOpen] = createSignal<boolean>(false)
  const [isClaimDialog, setIsClaimDialog] = createSignal<boolean>(false)
  const [isRentDialog, setIsRentDialog] = createSignal<boolean>(false)
  const router = useRouter()
  const { favDegens, toggleFavorite } = useFavoriteDegens()

  const { loadingDegens, degensBalances } = useNFTsBalances()

  const degenIds = createMemo(
    () => [...new Set(degensBalances.map((degen) => String(degen.id)))],
    [degensBalances]
  )
  const { data: degensData } = usePublicDegensByIds(degenIds)

  const filteredDegens = createMemo(() => {
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

  const handleClickEditName = ((degen: DashboardDegen): void => {
    setSelectedDegen(degen)
    setIsRenameDegenModalOpen(true)
  }, [])

  const handleViewTraits = ((degen: DashboardDegen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(false)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }, [])

  const handleClaimDegen = ((degen: DashboardDegen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(true)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }, [])

  const handleFavoriteToggle = (
    (degen: DashboardDegen): void => {
      void toggleFavorite(degen.id)
    },
    [toggleFavorite]
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
        styles={{ mainRow: { 'min-height': 300, 'max-height': 330, overflow: 'hidden' } }}
      >
        {loadingDegens ? (
          [...Array(8)].map((_, index) => (
            <div class="w-full sm:w-[91.6667%]" key={`my-degen-skeleton-${index}`}>
              <SkeletonDegenPlaceholder />
            </div>
          ))
        ) : filteredDegens.length && degensBalances.length ? (
          filteredDegens.map((degen) => (
            <div class="px-1">
              <DegenCard
                degen={degen}
                deferAnimatedMedia
                favs={favDegens}
                isDashboardDegen
                onClickClaim={handleClaimDegen}
                onClickDetail={handleViewTraits}
                onClickEditName={handleClickEditName}
                onClickFavorite={handleFavoriteToggle}
                size="small"
              />
            </div>
          ))
        ) : (
          <div class="flex items-center justify-center">
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
