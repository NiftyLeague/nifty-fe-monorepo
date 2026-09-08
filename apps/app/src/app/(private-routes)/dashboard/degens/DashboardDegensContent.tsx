'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAccount } from 'wagmi'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQueryStates } from 'nuqs'

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { Button } from '@nl/ui/base/button'
import { Dialog } from '@nl/ui/base/dialog'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import DEFAULT_STATIC_FILTER from '@/components/extended/DegensFilter/constants'
import {
  transformDataByFilter,
  getDefaultFilterValueFromData,
  DEGENS_PER_PAGE,
  getGridSizeClass,
  applySeventhTribesFix,
} from '@/components/extended/DegensFilter/utils'
import SectionTitle from '@/components/sections/SectionTitle'
import { DEGEN_COLLECTION_URL } from '@/constants/url'
import useFavoriteDegens from '@/hooks/useFavoriteDegens'
import useAuth from '@/hooks/useAuth'
import { usePublicDegensByIds } from '@/hooks/queries/usePublicDegens'
import { getPageItems } from '@/utils/pagination'
import type { DashboardDegen } from '@/types/degens'
import EmptyState from '@/components/EmptyState'
import DeferredDegensFilter from '@/components/providers/DeferredDegensFilter'
import DeferredDegenDialog from '@/components/providers/DeferredDegenDialog'
import DeferredRenameDegenDialog from '@/components/providers/DeferredRenameDegenDialog'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import DegensTopNav from '@/components/extended/DegensTopNav'
import { isAuditFixtureEnabled } from '@/audit/fixture'
import { degenSearchParsers, normalizeDegenSearchState, toDegenFilter } from '@/url/search-state'

const CollapsibleSidebarLayout = dynamic(() => import('@/app/_layout/_CollapsibleSidebarLayout'), {
  ssr: false,
})
const DegenCard = dynamic(
  () =>
    import('@/components/cards/DegenCard/DashboardDegenCard').then(
      (module) => module.DashboardDegenCardInView
    ),
  {
    ssr: false,
  }
)

const DashboardDegensPageContent = (): React.ReactNode => {
  const { isLoggedIn } = useAuth()
  const { isConnected } = useAccount()
  const hasConnectedAccount = isConnected || (isAuditFixtureEnabled && isLoggedIn)
  // Start closed so mobile does not push the first card below the fold before the
  // responsive drawer effect runs. The layout opens it after mount on desktop.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDegen, setSelectedDegen] = useState<DashboardDegen>()
  const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = useState<boolean>(false)
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false)
  const [isClaimDialog, setIsClaimDialog] = useState<boolean>(false)
  const [isRentDialog, setIsRentDialog] = useState<boolean>(false)
  const [rawSearchState, setSearchState] = useQueryStates(degenSearchParsers, {
    history: 'push',
    shallow: true,
  })
  const searchStateKey = JSON.stringify(rawSearchState)
  const searchState = useMemo(() => normalizeDegenSearchState(rawSearchState), [searchStateKey])
  const layoutMode = searchState.layout
  const { favDegens, toggleFavorite } = useFavoriteDegens()

  const { degensBalances, loadingDegens } = useNFTsBalances()

  const degenIds = useMemo(
    () => [...new Set(degensBalances.map((degen) => String(degen.id)))],
    [degensBalances]
  )
  const { isLoading: loadingAllRentals, data } = usePublicDegensByIds(degenIds)

  const loading = loadingAllRentals || loadingDegens

  const populatedDegens = useMemo(() => {
    if (!degensBalances.length || !data) return []

    const degensById = new Map(data.map((degen) => [degen.id, degen]))
    return degensBalances
      .map((degen) => degensById.get(String(degen.id)))
      .filter((degen): degen is DashboardDegen => Boolean(degen))
      .map(applySeventhTribesFix)
  }, [degensBalances, data])
  const defaultValues = useMemo(
    () => getDefaultFilterValueFromData(populatedDegens),
    [populatedDegens]
  )
  const filters = useMemo(
    () => toDegenFilter(searchState, defaultValues),
    [defaultValues, searchState]
  )
  const filteredData = useMemo(
    () => transformDataByFilter(populatedDegens, filters),
    [filters, populatedDegens]
  )

  const isMobile = useMediaQuery('(max-width:640px)')
  const isSmallScreen = useMediaQuery('(max-width:1280px)')
  const itemsPerPage =
    !isSmallScreen && layoutMode !== 'gridView' && !isDrawerOpen ? 18 : DEGENS_PER_PAGE
  const maxPage = Math.ceil(filteredData.length / itemsPerPage)
  const currentPage = Math.max(1, maxPage ? Math.min(searchState.page, maxPage) : 1)
  const dataForCurrentPage = useMemo(() => {
    const begin = (currentPage - 1) * itemsPerPage
    return filteredData.slice(begin, begin + itemsPerPage)
  }, [currentPage, filteredData, itemsPerPage])
  const pageItems = useMemo(() => getPageItems(currentPage, maxPage), [currentPage, maxPage])
  const jump = useCallback(
    (page: number) =>
      void setSearchState({ page: Math.max(1, maxPage ? Math.min(page, maxPage) : 1) }),
    [maxPage, setSearchState]
  )

  useEffect(() => {
    if (!loading && searchState.page !== currentPage) {
      void setSearchState({ page: currentPage }, { history: 'replace' })
    }
  }, [currentPage, loading, searchState.page, setSearchState])

  const handleChangeSearchTerm: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    e
  ) => {
    void setSearchState({ searchTerm: e.target.value || null, page: 1 }, { history: 'replace' })
  }

  const handleChangeLayoutMode = (_: React.MouseEvent<HTMLElement>, newMode: string) => {
    void setSearchState({ layout: newMode === 'gridOn' ? 'gridOn' : 'gridView', page: 1 })
  }

  const handleSort = useCallback(
    (sort: string) => {
      void setSearchState({ sort: sort === 'idDown' ? 'idDown' : 'idUp', page: 1 })
    },
    [setSearchState]
  )

  const handleClickEditName = useCallback((degen: DashboardDegen): void => {
    setSelectedDegen(degen)
    setIsRenameDegenModalOpen(true)
  }, [])

  const handleViewTraits = useCallback((degen: DashboardDegen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(false)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }, [])

  const handleClaimDegen = useCallback((degen: DashboardDegen): void => {
    setSelectedDegen(degen)
    setIsClaimDialog(true)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }, [])

  const isGridView = layoutMode === 'gridView'

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
    () => <DeferredDegensFilter defaultFilterValues={defaultValues} />,
    [defaultValues]
  )

  const renderDegen = useCallback(
    (degen: DashboardDegen) => (
      <div key={degen.id} className={getGridSizeClass(isGridView, isDrawerOpen)}>
        <DegenCard
          degen={degen}
          deferAnimatedMedia
          favs={favDegens}
          isDashboardDegen
          onClickClaim={() => handleClaimDegen(degen)}
          onClickDetail={() => handleViewTraits(degen)}
          onClickEditName={() => handleClickEditName(degen)}
          onClickFavorite={() => void toggleFavorite(degen.id)}
          size={isGridView ? 'normal' : 'small'}
        />
      </div>
    ),
    [
      favDegens,
      handleClaimDegen,
      handleClickEditName,
      toggleFavorite,
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
            <a
              href={DEGEN_COLLECTION_URL}
              target="_blank"
              rel="noreferrer"
              className="col-span-12 flex justify-center"
            >
              <EmptyState
                message="No DEGENs found. Please check your address or go purchase a DEGEN if you have not done so already!"
                buttonText="Buy a DEGEN"
              />
            </a>
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
      degensBalances.length,
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
            searchTerm={searchState.searchTerm}
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
