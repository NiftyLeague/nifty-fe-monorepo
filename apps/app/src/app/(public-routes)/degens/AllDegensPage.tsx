'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@nl/ui/base/button'
import { PaginationEllipsis } from '@nl/ui/base/pagination'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

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
import { PUBLIC_DEGENS_API_URL } from '@/constants/api'
import useFetch from '@/hooks/useFetch'
import usePagination from '@/hooks/usePagination'
import type { DegenFilter } from '@/types/degenFilter'
import type { PublicDegen } from '@/types/degens'
import DegensTopNav from '@/components/extended/DegensTopNav'
import DeferredDegenCard from '@/components/providers/DeferredDegenCard'
import DeferredDegensFilter from '@/components/providers/DeferredDegensFilter'
import DeferredPublicDegenDialog from '@/components/providers/DeferredPublicDegenDialog'
import { PaginationControls } from '@/components/pagination/PaginationControls'
import DegenSearchParamsBoundary from './DegenSearchParamsBoundary'

const CollapsibleSidebarLayout = dynamic(() => import('@/app/_layout/_CollapsibleSidebarLayout'))

const AllDegensPage = (): React.ReactNode => {
  // Start closed so mobile does not push the first card below the fold before the
  // responsive drawer effect runs. The layout opens it after mount on desktop.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filters, setFilters] = useState<DegenFilter>(DEFAULT_STATIC_FILTER)
  const [selectedDegen, setSelectedDegen] = useState<PublicDegen>()
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [searchParams, setSearchParams] = useState<Record<string, string>>({})
  const [layoutMode, setLayoutMode] = useState<string>('gridView')

  const { data } = useFetch<PublicDegen[]>(PUBLIC_DEGENS_API_URL, { sharedCache: true })

  const originalDegens = useMemo(() => {
    if (!data?.length) return []

    return data.map(applySeventhTribesFix)
  }, [data])

  const defaultValues = useMemo(
    () => (originalDegens.length ? getDefaultFilterValueFromData(originalDegens) : undefined),
    [originalDegens]
  )

  const isMobile = useMediaQuery('(max-width:640px)')
  const isSmallScreen = useMediaQuery('(max-width:1280px)')
  const filteredData = useMemo(
    () => tranformDataByFilter(originalDegens, filters),
    [filters, originalDegens]
  )
  const { jump, dataForCurrentPage, maxPage, currentPage, pageItems } = usePagination<PublicDegen>(
    filteredData,
    !isSmallScreen && layoutMode !== 'gridView' && !isDrawerOpen ? 18 : DEGENS_PER_PAGE
  )

  useEffect(() => {
    if (!originalDegens.length || !defaultValues) return
    if (searchParams.searchTerm) setSearchTerm(searchParams.searchTerm)
    const newFilterOptions = updateFilterValue(defaultValues, searchParams)
    if (newFilterOptions) setFilters(newFilterOptions)
  }, [defaultValues, originalDegens.length, searchParams])

  const handleSearchParamsChange = useCallback((nextSearchParams: Record<string, string>) => {
    setSearchParams(nextSearchParams)
  }, [])

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
      // TODO: Remove temp filter overrides if we want to enable filter functionailty
      // by prices, rentals, or wearables. Temp hardcoded to empty to avoid rentals filtering
      const newFilters = { ...filter, prices: [], rentals: [], wearable: [], sort: filters.sort }
      setFilters(newFilters)
    },
    [filters.sort]
  )

  const handleSort = useCallback(
    (sort: string) => {
      const newSort = { ...filters, sort }
      setFilters(newSort)
    },
    [filters]
  )

  const handleViewTraits = useCallback((degen: PublicDegen): void => {
    setSelectedDegen(degen)
    setIsDegenModalOpen(true)
  }, [])

  const isGridView = layoutMode === 'gridView'

  const renderSkeletonItem = useCallback(
    (_: undefined, index: number) => (
      <div key={`degen-skeleton-${index}`} className={getGridSizeClass(isGridView, isDrawerOpen)}>
        <SkeletonDegenPlaceholder size={isGridView ? 'normal' : 'small'} />
      </div>
    ),
    [isDrawerOpen, isGridView]
  )

  const renderDrawer = useCallback(
    () =>
      defaultValues && (
        <DeferredDegensFilter
          onFilter={handleFilter}
          defaultFilterValues={defaultValues}
          searchTerm={searchTerm}
        />
      ),
    [defaultValues, handleFilter, searchTerm]
  )

  const renderDegen = useCallback(
    (degen: PublicDegen) => (
      <div key={degen.id} className={getGridSizeClass(isGridView, isDrawerOpen)}>
        <DeferredDegenCard
          degen={degen}
          size={isGridView ? 'normal' : 'small'}
          onClickDetail={() => handleViewTraits(degen)}
        />
      </div>
    ),
    [handleViewTraits, isDrawerOpen, isGridView]
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
                <ChevronLeft absoluteStrokeWidth aria-hidden="true" size={28} strokeWidth={1.5} />
              ) : (
                <ChevronRight absoluteStrokeWidth aria-hidden="true" size={28} strokeWidth={1.5} />
              )}
            </Button>
            {filteredData.length} Degens
          </div>
        </SectionTitle>
        {/* Main grid content */}
        <div className="grid grid-cols-12 gap-4 -mt-9">
          {!originalDegens.length
            ? [...Array(8)].map(renderSkeletonItem)
            : dataForCurrentPage.map(renderDegen)}
        </div>
        <PaginationControls
          className="mx-auto flex-wrap justify-center gap-1 pb-4"
          buttonClassName={isMobile ? 'size-8' : undefined}
          hasNext={currentPage < maxPage}
          hasPrev={currentPage > 1}
          nextLabel="Next page"
          onClickNext={() => jump(currentPage + 1)}
          onClickPrev={() => jump(currentPage - 1)}
          pageLabel={pageItems.map((p) =>
            p === 'ellipsis-start' || p === 'ellipsis-end' ? (
              <PaginationEllipsis key={p} />
            ) : (
              <Button
                key={p}
                type="button"
                variant={p === currentPage ? 'default' : 'ghost'}
                size={isMobile ? 'sm' : 'icon'}
                className="cursor-pointer"
                onClick={() => jump(p)}
                aria-current={p === currentPage ? 'page' : undefined}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </Button>
            )
          )}
          previousLabel="Previous page"
        />
      </div>
    ),
    [
      currentPage,
      dataForCurrentPage,
      originalDegens.length,
      filteredData.length,
      isDrawerOpen,
      isMobile,
      jump,
      maxPage,
      pageItems,
      renderDegen,
      renderSkeletonItem,
    ]
  )

  return (
    <>
      <Suspense fallback={null}>
        <DegenSearchParamsBoundary onChange={handleSearchParamsChange} />
      </Suspense>
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
          // Filter drawer
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          renderDrawer={renderDrawer}
          // Main grid
          renderMain={renderMain}
        />
      </div>
      {isDegenModalOpen && (
        <DeferredPublicDegenDialog
          open
          degen={selectedDegen}
          onClose={() => setIsDegenModalOpen(false)}
        />
      )}
    </>
  )
}

export default AllDegensPage
