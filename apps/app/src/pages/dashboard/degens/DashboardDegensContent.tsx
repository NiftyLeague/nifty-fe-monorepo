import { createEffect, createMemo, createSignal, For, Show, type JSX } from 'solid-js'
import dynamic from '@/runtime/dynamic'
import { useAccount } from '@/runtime/wagmi'
import { ChevronLeft, ChevronRight } from 'lucide-solid'
import { useQueryStates } from '@/url/nuqs-solid'

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'
import { Button } from '@nl/ui/base/button'
import { Dialog } from '@nl/ui/base/dialog'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
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
import { useDebouncedSearchTerm } from '@/hooks/useDebouncedSearchTerm'
import { getPageItems } from '@/utils/pagination'
import type { DashboardDegen } from '@/types/degens'
import EmptyState from '@/components/EmptyState'
import DeferredDegensFilter from '@/components/providers/DeferredDegensFilter'
import DeferredDegenDialog from '@/components/providers/DeferredDegenDialog'
import DeferredRenameDegenDialog from '@/components/providers/DeferredRenameDegenDialog'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import DegensTopNav from '@/components/extended/DegensTopNav'
import type { DegenCardProps } from '@/components/cards/DegenCard'
import { isAuditFixtureEnabled } from '@/audit/fixture'
import { degenSearchParsers, normalizeDegenSearchState, toDegenFilter } from '@/url/search-state'

const CollapsibleSidebarLayout = dynamic(
  () => import('@/layouts/_layout/_CollapsibleSidebarLayout'),
  {
    ssr: false,
  }
)
const DegenCard = dynamic<DegenCardProps<DashboardDegen>>(
  () =>
    import('@/components/cards/DegenCard/DashboardDegenCard').then(
      (module) => module.DashboardDegenCardInView
    ),
  {
    ssr: false,
  }
)

const DashboardDegensPageContent = (): JSX.Element => {
  const auth = useAuth()
  const account = useAccount()
  const hasConnectedAccount = () =>
    account.isConnected || (isAuditFixtureEnabled && auth.isLoggedIn)
  // Start closed so mobile does not push the first card below the fold before the
  // responsive drawer effect runs. The layout opens it after mount on desktop.
  const [isDrawerOpen, setIsDrawerOpen] = createSignal(false)
  const [selectedDegen, setSelectedDegen] = createSignal<DashboardDegen>()
  const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = createSignal<boolean>(false)
  const [isDegenModalOpen, setIsDegenModalOpen] = createSignal<boolean>(false)
  const [isClaimDialog, setIsClaimDialog] = createSignal<boolean>(false)
  const [isRentDialog, setIsRentDialog] = createSignal<boolean>(false)
  const [rawSearchState, setSearchState] = useQueryStates(degenSearchParsers, {
    history: 'push',
  })
  const searchState = createMemo(() => normalizeDegenSearchState(rawSearchState))
  const layoutMode = () => searchState().layout
  const favorites = useFavoriteDegens()

  const nfts = useNFTsBalances()

  const degenIds = createMemo(() => [
    ...new Set(nfts.degensBalances.map((degen) => String(degen.id))),
  ])
  const publicDegensQuery = usePublicDegensByIds(degenIds)

  const loading = () => publicDegensQuery.isLoading || nfts.loadingDegens

  const populatedDegens = createMemo(() => {
    const data = publicDegensQuery.data
    if (!nfts.degensBalances.length || !data) return []

    const degensById = new Map(data.map((degen) => [degen.id, degen]))
    return nfts.degensBalances
      .map((degen) => degensById.get(String(degen.id)))
      .filter((degen): degen is DashboardDegen => Boolean(degen))
      .map(applySeventhTribesFix)
  })
  const defaultValues = createMemo(() => getDefaultFilterValueFromData(populatedDegens()))
  const filters = createMemo(() => toDegenFilter(searchState(), defaultValues()))
  const filteredData = createMemo(() => transformDataByFilter(populatedDegens(), filters()))

  const isMobile = useMediaQuery('(max-width:640px)')
  const isSmallScreen = useMediaQuery('(max-width:1280px)')
  const itemsPerPage = () =>
    !isSmallScreen() && layoutMode() !== 'gridView' && !isDrawerOpen() ? 18 : DEGENS_PER_PAGE
  const maxPage = () => Math.ceil(filteredData().length / itemsPerPage())
  const currentPage = () => Math.max(1, maxPage() ? Math.min(searchState().page, maxPage()) : 1)
  const dataForCurrentPage = createMemo(() => {
    const begin = (currentPage() - 1) * itemsPerPage()
    return filteredData().slice(begin, begin + itemsPerPage())
  })
  const pageItems = createMemo(() => getPageItems(currentPage(), maxPage()))
  const jump = (page: number) => {
    void setSearchState({ page: Math.max(1, maxPage() ? Math.min(page, maxPage()) : 1) })
  }

  createEffect(() => {
    if (!loading() && searchState().page !== currentPage()) {
      void setSearchState({ page: currentPage() }, { history: 'replace' })
    }
  })

  const commitSearchTerm = (searchTerm: string | null) => {
    void setSearchState({ searchTerm, page: 1 }, { history: 'replace' })
  }

  const [searchTermDraft, handleChangeSearchTerm] = useDebouncedSearchTerm(
    () => searchState().searchTerm,
    commitSearchTerm
  )

  const handleFavoriteToggle = (degen: DashboardDegen): void => {
    void favorites.toggleFavorite(degen.id)
  }

  const handleChangeLayoutMode = (
    _: MouseEvent & { currentTarget: HTMLElement },
    newMode: string
  ) => {
    void setSearchState({ layout: newMode === 'gridOn' ? 'gridOn' : 'gridView', page: 1 })
  }

  const handleSort = (sort: string) => {
    void setSearchState({ sort: sort === 'idDown' ? 'idDown' : 'idUp', page: 1 })
  }

  const handleClickEditName = (degen: DashboardDegen) => {
    setSelectedDegen(() => degen)
    setIsRenameDegenModalOpen(true)
  }

  const handleViewTraits = (degen: DashboardDegen) => {
    setSelectedDegen(() => degen)
    setIsClaimDialog(false)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }

  const handleClaimDegen = (degen: DashboardDegen) => {
    setSelectedDegen(() => degen)
    setIsClaimDialog(true)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }

  const isGridView = () => layoutMode() === 'gridView'

  const renderSkeletonItem = () => (
    <div class={getGridSizeClass(isGridView(), isDrawerOpen())}>
      <SkeletonDegenPlaceholder size={isGridView() ? 'normal' : 'small'} />
    </div>
  )

  const renderDrawer = () => <DeferredDegensFilter defaultFilterValues={defaultValues()} />

  const renderDegen = (degen: DashboardDegen) => (
    <div class={getGridSizeClass(isGridView(), isDrawerOpen())}>
      <DegenCard
        degen={degen}
        deferAnimatedMedia
        favs={favorites.favDegens}
        isDashboardDegen
        onClickClaim={handleClaimDegen}
        onClickDetail={handleViewTraits}
        onClickEditName={handleClickEditName}
        onClickFavorite={handleFavoriteToggle}
        size={isGridView() ? 'normal' : 'small'}
      />
    </div>
  )

  const renderMain = () => (
    <div class="flex h-full flex-col gap-3">
      {/* Main Grid title */}
      <SectionTitle firstSection>
        <div class="mb-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            class="cursor-pointer"
            aria-label={isDrawerOpen() ? 'Hide filters' : 'Show filters'}
            onClick={() => setIsDrawerOpen(!isDrawerOpen())}
          >
            {isDrawerOpen() ? (
              <ChevronLeft aria-hidden="true" size={28} stroke-width={1.5} />
            ) : (
              <ChevronRight aria-hidden="true" size={28} stroke-width={1.5} />
            )}
          </Button>
          {filteredData().length} Degens
        </div>
      </SectionTitle>
      {/* Main grid content */}
      <div
        class={`grid grid-cols-12 gap-4 -mt-9 ${
          !nfts.degensBalances.length ? 'h-full justify-center items-center' : ''
        }`}
      >
        <Show
          when={!loading() && hasConnectedAccount()}
          fallback={<For each={Array.from({ length: 8 })}>{() => renderSkeletonItem()}</For>}
        >
          <Show
            when={dataForCurrentPage().length}
            fallback={
              <Show when={!nfts.degensBalances.length}>
                <a
                  href={DEGEN_COLLECTION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="col-span-12 flex justify-center"
                >
                  <EmptyState
                    message="No DEGENs found. Please check your address or go purchase a DEGEN if you have not done so already!"
                    buttonText="Buy a DEGEN"
                  />
                </a>
              </Show>
            }
          >
            <For each={dataForCurrentPage()}>{renderDegen}</For>
          </Show>
        </Show>
      </div>
      <Show when={dataForCurrentPage().length > 0}>
        <div class="mx-auto flex flex-wrap items-center justify-center gap-1 pb-4">
          <Button
            variant="ghost"
            size={isMobile() ? 'sm' : 'icon'}
            class="cursor-pointer"
            disabled={currentPage() === 1}
            onClick={() => jump(currentPage() - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft aria-hidden="true" size={20} stroke-width={1.5} />
          </Button>
          <For each={pageItems()}>
            {(p) =>
              p === 'ellipsis-start' || p === 'ellipsis-end' ? (
                <span class="px-1 text-muted-foreground">…</span>
              ) : (
                <Button
                  variant={p === currentPage() ? 'default' : 'ghost'}
                  size={isMobile() ? 'sm' : 'icon'}
                  class="cursor-pointer"
                  onClick={() => jump(p)}
                >
                  {p}
                </Button>
              )
            }
          </For>
          <Button
            variant="ghost"
            size={isMobile() ? 'sm' : 'icon'}
            class="cursor-pointer"
            disabled={currentPage() === maxPage()}
            onClick={() => jump(currentPage() + 1)}
            aria-label="Next page"
          >
            <ChevronRight aria-hidden="true" size={20} stroke-width={1.5} />
          </Button>
        </div>
      </Show>
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
            sortValue={filters().sort ?? 'idUp'}
            layoutMode={layoutMode()}
            handleChangeLayoutMode={handleChangeLayoutMode}
          />
        </div>
        <CollapsibleSidebarLayout
          drawerWidth={320}
          isDrawerOpen={isDrawerOpen()}
          setIsDrawerOpen={setIsDrawerOpen}
          renderDrawer={renderDrawer}
          renderMain={renderMain}
        />
      </div>
      <Show when={isDegenModalOpen()}>
        <DeferredDegenDialog
          open
          degen={selectedDegen()}
          isClaim={isClaimDialog()}
          isRent={isRentDialog()}
          setIsClaim={setIsClaimDialog}
          setIsRent={setIsRentDialog}
          onClose={() => setIsDegenModalOpen(false)}
        />
      </Show>
      <Dialog
        open={isRenameDegenModalOpen()}
        onOpenChange={(open) => !open && setIsRenameDegenModalOpen(false)}
      >
        <DeferredRenameDegenDialog
          open={isRenameDegenModalOpen()}
          degen={selectedDegen()}
          onSuccess={() => setIsRenameDegenModalOpen(false)}
        />
      </Dialog>
    </>
  )
}

export default DashboardDegensPageContent
