'use client'

import { createMemo, createSignal, For, Show, type JSX } from 'solid-js'
import dynamic from '@/runtime/dynamic'
import { ChevronLeft, ChevronRight } from 'lucide-solid'
import { useQueryStates } from '@/url/nuqs-solid'

import { Button } from '@nl/ui/base/button'
import { PaginationEllipsis } from '@nl/ui/base/pagination'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import DEFAULT_STATIC_FILTER from '@/components/extended/DegensFilter/constants'
import { DEGENS_PER_PAGE, getGridSizeClass } from '@/components/extended/DegensFilter/utils'
import DegensTopNav from '@/components/extended/DegensTopNav'
import SectionTitle from '@/components/sections/SectionTitle'
import { getPageItems } from '@/utils/pagination'
import { useDebouncedSearchTerm } from '@/hooks/useDebouncedSearchTerm'
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

const AllDegensPage = (): JSX.Element => {
  // Start closed so mobile does not push the first card below the fold before the
  // responsive drawer effect runs. The layout opens it after mount on desktop.
  const [isDrawerOpen, setIsDrawerOpen] = createSignal(false)
  const [selectedDegen, setSelectedDegen] = createSignal<PublicDegen>()
  const [isDegenModalOpen, setIsDegenModalOpen] = createSignal(false)
  const [rawSearchState, setSearchState] = useQueryStates(degenSearchParsers, {
    history: 'push',
    shallow: true,
  })
  const searchState = createMemo(() => normalizeDegenSearchState(rawSearchState))
  const layoutMode = () => searchState().layout

  const isMobile = useMediaQuery('(max-width:640px)')
  const isSmallScreen = useMediaQuery('(max-width:1280px)')
  const isGridView = () => layoutMode() === 'gridView'
  const pageSize = () =>
    !isSmallScreen() && !isGridView() && !isDrawerOpen() ? 18 : DEGENS_PER_PAGE

  const requestQuery = createMemo(() =>
    buildPublicDegensRequestQuery(searchState(), pageSize())
  )

  const degensQuery = usePublicDegensPage(requestQuery)

  const pageData = createMemo(() => {
    const data = degensQuery.data
    return data ? fromPublicDegenPageWire(data) : undefined
  })
  const defaultValues = createMemo(() => ({
    ...DEFAULT_STATIC_FILTER,
    prices: pageData()?.priceRange ?? DEFAULT_STATIC_FILTER.prices,
  }))
  const currentPage = () => pageData()?.page ?? searchState().page
  const maxPage = () => Math.ceil((pageData()?.total ?? 0) / pageSize())
  const pageItems = createMemo(() => getPageItems(currentPage(), maxPage()))

  const jump = (page: number) => void setSearchState({ page: Math.max(1, page) })

  const commitSearchTerm = (searchTerm: string | null) =>
    void setSearchState({ searchTerm, page: 1 }, { history: 'replace' })
  const [searchTermDraft, handleChangeSearchTerm] = useDebouncedSearchTerm(
    () => searchState().searchTerm,
    commitSearchTerm
  )

  const handleChangeLayoutMode = (
    _event: MouseEvent & { currentTarget: HTMLElement },
    newMode: string
  ) => {
    void setSearchState({ layout: newMode === 'gridOn' ? 'gridOn' : 'gridView', page: 1 })
  }

  const handleSort = (sort: string) =>
    void setSearchState({ sort: sort === 'idDown' ? 'idDown' : 'idUp', page: 1 })

  const handleViewTraits = (degen: PublicDegen): void => {
    setSelectedDegen(() => degen)
    setIsDegenModalOpen(true)
  }

  const renderSkeletonItem = (index: number) => (
    <div class={getGridSizeClass(isGridView(), isDrawerOpen())}>
      <SkeletonDegenPlaceholder size={isGridView() ? 'normal' : 'small'} />
    </div>
  )

  const renderDegen = (degen: PublicDegen) => (
    <div class={getGridSizeClass(isGridView(), isDrawerOpen())}>
      <DeferredDegenCard
        degen={degen}
        deferAnimatedMedia
        size={isGridView() ? 'normal' : 'small'}
        onClickDetail={handleViewTraits}
      />
    </div>
  )

  const renderDrawer = () => <DeferredDegensFilter defaultFilterValues={defaultValues()} />

  const renderMain = () => (
    <div class="flex h-full flex-col gap-3">
      <SectionTitle firstSection>
        <div class="mb-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            class="cursor-pointer"
            aria-label={isDrawerOpen() ? 'Hide filters' : 'Show filters'}
            onClick={() => setIsDrawerOpen((open) => !open)}
          >
            {isDrawerOpen() ? (
              <ChevronLeft aria-hidden="true" size={28} stroke-width={1.5} />
            ) : (
              <ChevronRight aria-hidden="true" size={28} stroke-width={1.5} />
            )}
          </Button>
          {pageData()?.total ?? 0} Degens
        </div>
      </SectionTitle>
      <div class="grid grid-cols-12 gap-4 -mt-9">
        <Show
          when={!degensQuery.error}
          fallback={
            <div class="col-span-12">
              <QueryErrorState
                error={degensQuery.error as Error}
                onRetry={() => void degensQuery.refetch()}
              />
            </div>
          }
        >
          <Show
            when={pageData()}
            keyed
            fallback={
              <For each={Array.from({ length: 8 })}>
                {(_, index) => renderSkeletonItem(index())}
              </For>
            }
          >
            {(page) => <For each={page.items}>{renderDegen}</For>}
          </Show>
        </Show>
      </div>
      <PaginationControls
        class="mx-auto flex-wrap justify-center gap-1 pb-4"
        buttonClassName={isMobile() ? 'size-8' : undefined}
        hasNext={currentPage() < maxPage()}
        hasPrev={currentPage() > 1}
        nextLabel="Next page"
        onClickNext={() => jump(currentPage() + 1)}
        onClickPrev={() => jump(currentPage() - 1)}
        pageLabel={
          <For each={pageItems()}>
            {(p) =>
              p === 'ellipsis-start' || p === 'ellipsis-end' ? (
                <PaginationEllipsis />
              ) : (
                <Button
                  type="button"
                  variant={p === currentPage() ? 'default' : 'ghost'}
                  size={isMobile() ? 'sm' : 'icon'}
                  class="cursor-pointer"
                  onClick={() => jump(p)}
                  aria-current={p === currentPage() ? 'page' : undefined}
                  aria-label={`Go to page ${p}`}
                >
                  {p}
                </Button>
              )
            }
          </For>
        }
        previousLabel="Previous page"
      />
    </div>
  )

  return (
    <>
      <div class="flex h-full flex-col justify-start align-top gap-4 pl-2">
        <div class="pl-4 pr-6">
          <DegensTopNav
            searchTerm={searchTermDraft()}
            handleChangeSearchTerm={handleChangeSearchTerm}
            handleSort={handleSort}
            sortValue={searchState().sort}
            layoutMode={layoutMode()}
            handleChangeLayoutMode={handleChangeLayoutMode}
          />
        </div>
        <CollapsibleSidebarLayout
          isDrawerOpen={isDrawerOpen()}
          setIsDrawerOpen={setIsDrawerOpen}
          renderDrawer={renderDrawer}
          renderMain={renderMain}
        />
      </div>
      <Show when={isDegenModalOpen()}>
        <DeferredPublicDegenDialog
          open
          degen={selectedDegen()}
          onClose={() => setIsDegenModalOpen(false)}
        />
      </Show>
    </>
  )
}

export default AllDegensPage
