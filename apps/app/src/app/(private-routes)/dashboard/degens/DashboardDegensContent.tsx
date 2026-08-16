'use client'
/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useAccount } from 'wagmi'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { Button } from '@nl/ui/base/button'
import { Dialog } from '@nl/ui/base/dialog'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import DEFAULT_STATIC_FILTER from '@/components/extended/DegensFilter/constants'
import {
  tranformDataByFilter,
  updateFilterValue,
  getDefaultFilterValueFromData,
  DEGENS_PER_PAGE,
  getGridSizeClass,
  applySeventhTribesFix,
} from '@/components/extended/DegensFilter/utils'
import SectionTitle from '@/components/sections/SectionTitle'
import { DEGEN_BASE_API_URL, DEGEN_COLLECTION_URL, PROFILE_FAV_DEGENS_API } from '@/constants/url'
import { useProfileFavDegens } from '@/hooks/useGamerProfile'
import useAuth from '@/hooks/useAuth'
import useFetch from '@/hooks/useFetch'
import useFlags from '@/hooks/useFlags'
import usePagination from '@/hooks/usePagination'
import type { DegenFilter } from '@/types/degenFilter'
import type { Degen } from '@/types/degens'
import EmptyState from '@/components/EmptyState'
import DeferredDegensFilter from '@/components/providers/DeferredDegensFilter'
import DeferredDegenDialog from '@/components/providers/DeferredDegenDialog'
import DeferredRenameDegenDialog from '@/components/providers/DeferredRenameDegenDialog'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import DegensTopNav from '@/components/extended/DegensTopNav'
import useLocalStorageContext from '@/hooks/useLocalStorageContext'
import { isAuditFixtureEnabled } from '@/audit/fixture'
import { hasEntries, toggleValue } from '@/utils/collections'

const CollapsibleSidebarLayout = dynamic(() => import('@/app/_layout/_CollapsibleSidebarLayout'), {
  ssr: false,
})
const DegenCard = dynamic(() => import('@/components/cards/DegenCard/DashboardDegenCard'), {
  ssr: false,
})

const DashboardDegensPageContent = (): React.ReactNode => {
  const { authToken, isLoggedIn } = useAuth()
  const { isConnected } = useAccount()
  const hasConnectedAccount = isConnected || (isAuditFixtureEnabled && isLoggedIn)
  // Start closed so mobile does not push the first card below the fold before the
  // responsive drawer effect runs. The layout opens it after mount on desktop.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<DegenFilter>(DEFAULT_STATIC_FILTER)
  const [defaultValues, setDefaultValues] = useState<DegenFilter | undefined>(DEFAULT_STATIC_FILTER)
  const [filteredData, setFilteredData] = useState<Degen[]>([])
  const [selectedDegen, setSelectedDegen] = useState<Degen>()
  const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = useState<boolean>(false)
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false)
  const [isClaimDialog, setIsClaimDialog] = useState<boolean>(false)
  const [isRentDialog, setIsRentDialog] = useState<boolean>(false)
  const [isEquipDialog, setIsEquipDialog] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [layoutMode, setLayoutMode] = useState<string>('gridView')
  const { enableEquip } = useFlags()
  const { favs: favsData } = useProfileFavDegens()
  const { favDegens, setFavDegens } = useLocalStorageContext()

  useEffect(() => {
    if (favsData && favsData !== 'null') {
      setFavDegens(favsData.split(','))
    }
  }, [favsData, setFavDegens])

  const { loading: loadingAllRentals, data } = useFetch<Degen[]>(
    `${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`,
    { sharedCache: true }
  )

  const { degensBalances, loadingDegens } = useNFTsBalances()

  const loading = loadingAllRentals || loadingDegens

  const populatedDegens: Degen[] = useMemo(() => {
    if (!degensBalances?.length || !data) return []
    return degensBalances.map((degen) =>
      applySeventhTribesFix((data[Number(degen.id)] as Degen) || degen)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [degensBalances?.length, !!data])

  const isMobile = useMediaQuery('(max-width:640px)')
  const isSmallScreen = useMediaQuery('(max-width:1280px)')
  const { jump, dataForCurrentPage, maxPage, currentPage, pageItems } = usePagination<Degen>(
    filteredData,
    !isSmallScreen && layoutMode !== 'gridView' && !isDrawerOpen ? 18 : DEGENS_PER_PAGE
  )

  useEffect(() => {
    if (!populatedDegens.length) {
      return
    }

    setDefaultValues(getDefaultFilterValueFromData(populatedDegens))
    const params = Object.fromEntries(searchParams.entries())
    let newDegens = populatedDegens
    if (hasEntries(params)) {
      if (params.searchTerm) setSearchTerm(params.searchTerm)
      const newFilterOptions = updateFilterValue(defaultValues, params)
      if (newFilterOptions) {
        setFilters(newFilterOptions)
        newDegens = tranformDataByFilter(populatedDegens, newFilterOptions)
      }
    }
    setFilteredData(newDegens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [populatedDegens.length])

  const handleChangeSearchTerm: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    e
  ) => {
    setSearchTerm(e.target.value)
  }

  const handleChangeLayoutMode = (_: React.MouseEvent<HTMLElement>, newMode: string) => {
    setLayoutMode(newMode)
  }

  const handleFilter = useCallback(
    (filter: DegenFilter) => {
      const newFilters = { ...filter, sort: filters.sort }
      const result = tranformDataByFilter(populatedDegens, newFilters)
      setFilters(newFilters)
      setFilteredData(result)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [populatedDegens.length, filters.sort]
  )

  useEffect(() => {
    jump(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData.length])

  const handleSort = useCallback(
    (sort: string) => {
      const newSort = { ...filters, sort }
      setFilters(newSort)
      setFilteredData(tranformDataByFilter(populatedDegens, newSort))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [populatedDegens.length, filters]
  )

  const handleClickEditName = useCallback((degen: Degen): void => {
    setSelectedDegen(degen)
    setIsRenameDegenModalOpen(true)
  }, [])

  const handleViewTraits = useCallback((degen: Degen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(false)
    setIsEquipDialog(false)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }, [])

  const handleClaimDegen = useCallback((degen: Degen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(true)
    setIsEquipDialog(false)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }, [])

  const handleRentDegen = useCallback((degen: Degen): void => {
    setSelectedDegen(degen)
    setIsRentDialog(true)
    setIsClaimDialog(false)
    setIsEquipDialog(false)
    setIsDegenModalOpen(true)
  }, [])

  const handleEquipDegen = useCallback((degen: Degen): void => {
    setSelectedDegen(degen)
    setIsRentDialog(false)
    setIsClaimDialog(false)
    setIsEquipDialog(true)
    setIsDegenModalOpen(true)
  }, [])

  const isGridView = layoutMode === 'gridView'

  const handleClickFavorite = useCallback(
    async (degen: Degen) => {
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

  const renderSkeletonItem = useCallback(
    (_: undefined, index: number) => (
      <div
        key={`dashboard-degen-skeleton-${index}`}
        className={getGridSizeClass(isGridView, isDrawerOpen)}
      >
        <SkeletonDegenPlaceholder size={isGridView ? 'normal' : 'small'} />
      </div>
    ),
    [isDrawerOpen, isGridView]
  )

  const renderDrawer = useCallback(
    () => (
      <DeferredDegensFilter
        onFilter={handleFilter}
        defaultFilterValues={defaultValues as DegenFilter}
        searchTerm={searchTerm}
      />
    ),
    [defaultValues, handleFilter, searchTerm]
  )

  const renderDegen = useCallback(
    (degen: Degen) => (
      <div key={degen.id} className={getGridSizeClass(isGridView, isDrawerOpen)}>
        <DegenCard
          degen={degen}
          degenEquipEnabled={enableEquip}
          favs={favDegens}
          isDashboardDegen
          onClickClaim={() => handleClaimDegen(degen)}
          onClickDetail={() => handleViewTraits(degen)}
          onClickEditName={() => handleClickEditName(degen)}
          onClickEquip={() => handleEquipDegen(degen)}
          onClickFavorite={() => handleClickFavorite(degen)}
          onClickRent={() => handleRentDegen(degen)}
          size={isGridView ? 'normal' : 'small'}
        />
      </div>
    ),
    [
      enableEquip,
      favDegens,
      handleClaimDegen,
      handleClickEditName,
      handleClickFavorite,
      handleEquipDegen,
      handleRentDegen,
      handleViewTraits,
      isDrawerOpen,
      isGridView,
    ]
  )

  const renderMain = useCallback(
    () => (
      <div className="flex h-full flex-col gap-3">
        {/* Main Grid title */}
        <SectionTitle firstSection>
          <div className="mb-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              aria-label={isDrawerOpen ? 'Hide filters' : 'Show filters'}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              {isDrawerOpen ? (
                <ChevronLeft aria-hidden="true" absoluteStrokeWidth size={28} strokeWidth={1.5} />
              ) : (
                <ChevronRight aria-hidden="true" absoluteStrokeWidth size={28} strokeWidth={1.5} />
              )}
            </Button>
            {filteredData.length} Degens
          </div>
        </SectionTitle>
        {/* Main grid content */}
        <div
          className={`grid grid-cols-12 gap-4 -mt-9 ${
            !degensBalances?.length ? 'h-full justify-center items-center' : ''
          }`}
        >
          {loading || !hasConnectedAccount ? (
            [...Array(8)].map(renderSkeletonItem)
          ) : dataForCurrentPage.length ? (
            dataForCurrentPage.map(renderDegen)
          ) : !degensBalances?.length ? (
            <Link
              href={DEGEN_COLLECTION_URL}
              target="_blank"
              rel="noreferrer"
              className="col-span-12 flex justify-center"
            >
              <EmptyState
                message="No DEGENs found. Please check your address or go purchase a DEGEN if you have not done so already!"
                buttonText="Buy a DEGEN"
              />
            </Link>
          ) : null}
        </div>
        {dataForCurrentPage.length > 0 && (
          <div
            className="mx-auto flex flex-wrap items-center justify-center gap-1"
            style={{ paddingBottom: '16px' }}
          >
            <Button
              variant="ghost"
              size={isMobile ? 'sm' : 'icon'}
              className="cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => jump(currentPage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft aria-hidden="true" absoluteStrokeWidth size={20} strokeWidth={1.5} />
            </Button>
            {pageItems.map((p) =>
              p === 'ellipsis-start' || p === 'ellipsis-end' ? (
                <span key={p} className="px-1 text-muted-foreground">
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === currentPage ? 'default' : 'ghost'}
                  size={isMobile ? 'sm' : 'icon'}
                  className="cursor-pointer"
                  onClick={() => jump(p)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              variant="ghost"
              size={isMobile ? 'sm' : 'icon'}
              className="cursor-pointer"
              disabled={currentPage === maxPage}
              onClick={() => jump(currentPage + 1)}
              aria-label="Next page"
            >
              <ChevronRight aria-hidden="true" absoluteStrokeWidth size={20} strokeWidth={1.5} />
            </Button>
          </div>
        )}
      </div>
    ),
    [
      currentPage,
      dataForCurrentPage,
      degensBalances?.length,
      filteredData.length,
      hasConnectedAccount,
      isDrawerOpen,
      isMobile,
      jump,
      loading,
      maxPage,
      pageItems,
      renderDegen,
      renderSkeletonItem,
    ]
  )

  return (
    <>
      <div className="flex h-full flex-col justify-start align-top gap-4 pl-2">
        <div className="pl-4 pr-6">
          <DegensTopNav
            searchTerm={searchTerm || ''}
            handleChangeSearchTerm={handleChangeSearchTerm}
            handleSort={handleSort}
            sortValue={filters.sort ?? 'idUp'}
            layoutMode={layoutMode}
            handleChangeLayoutMode={handleChangeLayoutMode}
          />
        </div>
        <CollapsibleSidebarLayout
          drawerWidth={320}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          renderDrawer={renderDrawer}
          renderMain={renderMain}
        />
      </div>
      {isDegenModalOpen && (
        <DeferredDegenDialog
          open
          degen={selectedDegen}
          isClaim={isClaimDialog}
          isRent={isRentDialog}
          isEquip={isEquipDialog}
          setIsClaim={setIsClaimDialog}
          setIsRent={setIsRentDialog}
          onClose={() => setIsDegenModalOpen(false)}
        />
      )}
      <Dialog
        open={isRenameDegenModalOpen}
        onOpenChange={(open) => !open && setIsRenameDegenModalOpen(false)}
      >
        <DeferredRenameDegenDialog
          open={isRenameDegenModalOpen}
          degen={selectedDegen}
          onSuccess={() => setIsRenameDegenModalOpen(false)}
        />
      </Dialog>
    </>
  )
}

export default DashboardDegensPageContent
