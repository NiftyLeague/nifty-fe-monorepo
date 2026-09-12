'use client'

import { useCallback, useMemo, useState } from 'react'
import dynamic from '@/runtime/dynamic'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQueryStates } from 'nuqs'

import { Button } from '@nl/ui/base/button'
import { PaginationEllipsis } from '@nl/ui/base/pagination'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import DEFAULT_STATIC_FILTER from '@/components/extended/DegensFilter/constants'
import { DEGENS_PER_PAGE, getGridSizeClass } from '@/components/extended/DegensFilter/utils'
import DegensTopNav from '@/components/extended/DegensTopNav'
import SectionTitle from '@/components/sections/SectionTitle'
import { getPageItems } from '@/utils/pagination'
import { usePublicDegensPage } from '@/hooks/queries/usePublicDegens'
import type { PublicDegen } from '@/types/degens'
import { fromPublicDegenPageWire } from '@/utils/public-degens'
import DeferredDegenCard from '@/components/providers/DeferredDegenCard'
import DeferredDegensFilter from '@/components/providers/DeferredDegensFilter'
import DeferredPublicDegenDialog from '@/components/providers/DeferredPublicDegenDialog'
import { PaginationControls } from '@/components/pagination/PaginationControls'
import {
  buildPublicDegensRequestQuery,
  degenSearchParsers,
  normalizeDegenSearchState,
} from '@/url/search-state'
import QueryErrorState from '@/components/QueryErrorState'

const CollapsibleSidebarLayout = dynamic(
  () => import('@/layouts/_layout/_CollapsibleSidebarLayout')
)

const AllDegensPage = (): React.ReactNode => {
  // Start closed so mobile does not push the first card below the fold before the
  // responsive drawer effect runs. The layout opens it after mount on desktop.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDegen, setSelectedDegen] = useState<PublicDegen>()
  const [isDegenModalOpen, setIsDegenModalOpen] = useState(false)
  const [rawSearchState, setSearchState] = useQueryStates(degenSearchParsers, {
    history: 'push',
    shallow: true,
  })
  const searchStateKey = JSON.stringify(rawSearchState)
  const searchState = useMemo(() => normalizeDegenSearchState(rawSearchState), [searchStateKey])
  const layoutMode = searchState.layout

  const isMobile = useMediaQuery('(max-width:640px)')
  const isSmallScreen = useMediaQuery('(max-width:1280px)')
  const isGridView = layoutMode === 'gridView'
  const pageSize = !isSmallScreen && !isGridView && !isDrawerOpen ? 18 : DEGENS_PER_PAGE
  const requestedPage = searchState.page
  const sortValue = searchState.sort

  const requestQuery = useMemo(() => {
    return buildPublicDegensRequestQuery(searchState, pageSize)
  }, [pageSize, requestedPage, searchState])

  const { data, error, refetch } = usePublicDegensPage(requestQuery)

  const pageData = useMemo(() => (data ? fromPublicDegenPageWire(data) : undefined), [data])
  const defaultValues = useMemo(
    () => ({
      ...DEFAULT_STATIC_FILTER,
      prices: pageData?.priceRange ?? DEFAULT_STATIC_FILTER.prices,
    }),
    [pageData?.priceRange]
  )
  const currentPage = pageData?.page ?? requestedPage
  const maxPage = Math.ceil((pageData?.total ?? 0) / pageSize)
  const pageItems = useMemo(() => getPageItems(currentPage, maxPage), [currentPage, maxPage])

  const jump = useCallback(
    (page: number) => void setSearchState({ page: Math.max(1, page) }),
    [setSearchState]
  )

  const handleChangeSearchTerm: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    e
  ) => {
    void setSearchState({ searchTerm: e.target.value || null, page: 1 }, { history: 'replace' })
  }

  const handleChangeLayoutMode = (_event: React.MouseEvent<HTMLElement>, newMode: string) => {
    void setSearchState({ layout: newMode === 'gridOn' ? 'gridOn' : 'gridView', page: 1 })
  }

  const handleSort = useCallback(
    (sort: string) => void setSearchState({ sort: sort === 'idDown' ? 'idDown' : 'idUp', page: 1 }),
    [setSearchState]
  )

  const handleViewTraits = useCallback((degen: PublicDegen): void => {
    setSelectedDegen(degen)
    setIsDegenModalOpen(true)
  }, [])

  const renderSkeletonItem = useCallback(
    (_: undefined, index: number) => (
      <div key={`degen-skeleton-${index}`} className={getGridSizeClass(isGridView, isDrawerOpen)}>
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
    (degen: PublicDegen) => (
      <div key={degen.id} className={getGridSizeClass(isGridView, isDrawerOpen)}>
        <DeferredDegenCard
          degen={degen}
          deferAnimatedMedia
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
            {pageData?.total ?? 0} Degens
          </div>
        </SectionTitle>
        <div className="grid grid-cols-12 gap-4 -mt-9">
          {error ? (
            <div className="col-span-12">
              <QueryErrorState error={error} onRetry={() => void refetch()} />
            </div>
          ) : !pageData ? (
            [...Array(8)].map(renderSkeletonItem)
          ) : (
            pageData.items.map(renderDegen)
          )}
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
      isDrawerOpen,
      isMobile,
      jump,
      maxPage,
      pageData,
      pageItems,
      error,
      refetch,
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
            sortValue={sortValue}
            layoutMode={layoutMode}
            handleChangeLayoutMode={handleChangeLayoutMode}
          />
        </div>
        <CollapsibleSidebarLayout
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          renderDrawer={renderDrawer}
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
