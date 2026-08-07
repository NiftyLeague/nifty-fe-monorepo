'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@nl/ui/base/button'
import { Dialog } from '@nl/ui/base/dialog'
import { Icon } from '@nl/ui/base/icon'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import SkeletonDegenPlaceholder from '@/components/cards/Skeleton/DegenPlaceholder'
import DegensFilter from '@/components/extended/DegensFilter'
import DEFAULT_STATIC_FILTER from '@/components/extended/DegensFilter/constants'
import {
  tranformDataByFilter,
  updateFilterValue,
  getDefaultFilterValueFromData,
  DEGENS_PER_PAGE,
  getGridSizeClass,
  applySeventhTribesFix,
} from '@/components/extended/DegensFilter/utils'
import RenameDegenDialogContent from '@/app/(private-routes)/dashboard/degens/_dialogs/RenameDegenDialogContent'
import SectionTitle from '@/components/sections/SectionTitle'
import { DEGEN_BASE_API_URL } from '@/constants/url'
import useFetch from '@/hooks/useFetch'
import usePagination from '@/hooks/usePagination'
import type { DegenFilter } from '@/types/degenFilter'
import type { Degen } from '@/types/degens'
import useNetworkContext from '@/hooks/useNetworkContext'
import DegenDialog from '@/components/dialog/DegenDialog'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import DegensTopNav from '@/components/extended/DegensTopNav'

const CollapsibleSidebarLayout = dynamic(() => import('@/app/_layout/_CollapsibleSidebarLayout'), {
  ssr: false,
})
const DegenCard = dynamic(() => import('@/components/cards/DegenCard'), { ssr: false })

const AllDegensPage = (): React.ReactNode => {
  const { address } = useNetworkContext()
  const [degens, setDegens] = useState<Degen[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [filters, setFilters] = useState<DegenFilter>(DEFAULT_STATIC_FILTER)
  const [defaultValues, setDefaultValues] = useState<DegenFilter | undefined>()
  const [filteredData, setFilteredData] = useState<Degen[]>([])
  const [selectedDegen, setSelectedDegen] = useState<Degen>()
  const [isRenameDegenModalOpen, setIsRenameDegenModalOpen] = useState<boolean>(false)
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false)
  const [isRentDialog, setIsRentDialog] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [layoutMode, setLayoutMode] = useState<string>('gridView')

  const { data } = useFetch<{ [id: number]: Degen }>(
    `${DEGEN_BASE_API_URL}/cache/rentals/rentables.json`
  )

  const originalDegens: Degen[] = useMemo(() => {
    if (!data || !Object.values(data).length) return []

    return Object.values(data).map(applySeventhTribesFix)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!data])

  const { isDegenOwner } = useNFTsBalances()

  const isMobile = useMediaQuery('(max-width:640px)')
  const isSmallScreen = useMediaQuery('(max-width:1280px)')
  const { jump, dataForCurrentPage, maxPage, currentPage } = usePagination<Degen>(
    filteredData,
    !isSmallScreen && layoutMode !== 'gridView' && !isDrawerOpen ? 18 : DEGENS_PER_PAGE
  )

  useEffect(() => {
    if (!originalDegens?.length) return
    setDefaultValues(getDefaultFilterValueFromData(originalDegens))
    // Filter out rent disabled degens in Feed
    setDegens(originalDegens)
    const params = Object.fromEntries(searchParams.entries())
    let newDegens = originalDegens
    if (!isEmpty(params)) {
      if (params.searchTerm) setSearchTerm(params.searchTerm)
      const newFilterOptions = updateFilterValue(defaultValues, params)
      if (newFilterOptions) {
        setFilters(newFilterOptions)
        newDegens = tranformDataByFilter(originalDegens, newFilterOptions)
      }
    }

    setFilteredData(newDegens)

    return () => {
      setDegens([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalDegens, address])

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
      const result = tranformDataByFilter(degens, newFilters)
      setFilters(newFilters)
      setFilteredData(result)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [degens?.length, filters.sort]
  )

  const handleSort = useCallback(
    (sort: string) => {
      const newSort = { ...filters, sort }
      setFilters(newSort)
      setFilteredData(tranformDataByFilter(degens, newSort))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [degens?.length, filters]
  )

  const handleClickEditName = useCallback((degen: Degen): void => {
    setSelectedDegen(degen)
    setIsRenameDegenModalOpen(true)
  }, [])

  const handleViewTraits = useCallback((degen: Degen): void => {
    setSelectedDegen(degen)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }, [])

  const isGridView = layoutMode === 'gridView'

  const renderSkeletonItem = useCallback(
    () => (
      <div key={uuidv4()} className={getGridSizeClass(isGridView, isDrawerOpen)}>
        <SkeletonDegenPlaceholder size={isGridView ? 'normal' : 'small'} />
      </div>
    ),
    [isDrawerOpen, isGridView]
  )

  const renderDrawer = useCallback(
    () =>
      !isEmpty(defaultValues) && (
        <DegensFilter
          onFilter={handleFilter}
          defaultFilterValues={defaultValues as DegenFilter}
          isDegenOwner={isDegenOwner}
          searchTerm={searchTerm}
        />
      ),
    [defaultValues, isDegenOwner, handleFilter, searchTerm]
  )

  const renderDegen = useCallback(
    (degen: Degen) => (
      <div key={degen.id} className={getGridSizeClass(isGridView, isDrawerOpen)}>
        <DegenCard
          degen={degen}
          size={isGridView ? 'normal' : 'small'}
          onClickEditName={() => handleClickEditName(degen)}
          onClickDetail={() => handleViewTraits(degen)}
        />
      </div>
    ),
    [handleClickEditName, handleViewTraits, isDrawerOpen, isGridView]
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
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <Icon name={isDrawerOpen ? 'chevron-left' : 'chevron-right'} size="xl" />
            </Button>
            {filteredData.length} Degens
          </div>
        </SectionTitle>
        {/* Main grid content */}
        <div className="grid grid-cols-24 gap-4 -mt-9">
          {!degens?.length
            ? [...Array(8)].map(renderSkeletonItem)
            : dataForCurrentPage.map(renderDegen)}
        </div>
        <div className="mx-auto flex items-center gap-1" style={{ paddingBottom: '16px' }}>
          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'icon'}
            className="cursor-pointer"
            disabled={currentPage === 1}
            onClick={() => jump(currentPage - 1)}
            aria-label="Previous page"
          >
            <Icon name="chevron-left" />
          </Button>
          {Array.from({ length: maxPage }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === currentPage ? 'default' : 'ghost'}
              size={isMobile ? 'sm' : 'icon'}
              className="cursor-pointer"
              onClick={() => jump(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="ghost"
            size={isMobile ? 'sm' : 'icon'}
            className="cursor-pointer"
            disabled={currentPage === maxPage}
            onClick={() => jump(currentPage + 1)}
            aria-label="Next page"
          >
            <Icon name="chevron-right" />
          </Button>
        </div>
      </div>
    ),
    [
      currentPage,
      dataForCurrentPage,
      degens?.length,
      filteredData.length,
      isDrawerOpen,
      isMobile,
      jump,
      maxPage,
      renderDegen,
      renderSkeletonItem,
    ]
  )

  return (
    <>
      <div className="flex h-full flex-col justify-center align-top gap-4 pl-2">
        <div className="pl-4 pr-6">
          <DegensTopNav
            searchTerm={searchTerm || ''}
            handleChangeSearchTerm={handleChangeSearchTerm}
            handleSort={handleSort}
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
      <DegenDialog
        open={isDegenModalOpen}
        degen={selectedDegen}
        isRent={isRentDialog}
        setIsRent={setIsRentDialog}
        onClose={() => setIsDegenModalOpen(false)}
      />
      <Dialog
        open={isRenameDegenModalOpen}
        onOpenChange={(open) => !open && setIsRenameDegenModalOpen(false)}
      >
        <RenameDegenDialogContent
          degen={selectedDegen}
          onSuccess={() => setIsRenameDegenModalOpen(false)}
        />
      </Dialog>
    </>
  )
}

export default AllDegensPage
