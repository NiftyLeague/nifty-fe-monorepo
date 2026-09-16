import { createEffect, createMemo, createSignal, For, Show, type JSX } from 'solid-js'
import { useQueryStates } from '@/url/nuqs-solid'
import { ChevronDown, ChevronUp, Pencil } from 'lucide-solid'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@nl/ui/base/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nl/ui/base/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nl/ui/base/table'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { formatNumberToDisplay } from '@nl/ui/number-format'
import type { Rentals, RentalType } from '@/types/rentals'
import type { Degen } from '@/types/degens'
import { transformRentals } from '@/pages/dashboard/_utils/transformRentals'
import usePlayerProfile from '@/hooks/usePlayerProfile'
import { Countdown } from '@nl/ui/base/countdown'
import useLocalStorage from '@/hooks/useLocalStorage'

import DeferredDegenDialog from '@/components/providers/DeferredDegenDialog'
import DeferredChangeNicknameDialog from '@/components/providers/DeferredChangeNicknameDialog'
import { PaginationControls } from '@/components/pagination/PaginationControls'
import { RentalDataGrid } from '@/types/rentalDataGrid'
import { normalizePage, rentalSearchParsers } from '@/url/search-state'

const RENTAL_COLUMN_VISIBILITY = 'rental-column-visibility-model'
const PAGE_SIZE_OPTIONS = [10, 25, 100]

interface RenderCellParams {
  value: unknown
  row: RentalDataGrid
  field?: string
  id?: string | number
}

interface TableColumn {
  field: string
  headerName?: string
  width?: number
  minWidth?: number
  sortable?: boolean
  renderCell?: (params: RenderCellParams) => JSX.Element
}

type ColumnVisibilityModel = Record<string, boolean>

interface SortState {
  field: string
  direction: 'asc' | 'desc'
}

interface Props {
  rows: Rentals[]
  loading: boolean
  category: RentalType
  onTerminateRental: (rentalId: string) => void
  updateRentalName: (name: string, id: string) => void
}

const MyRentalsDataGrid = (props: Props): JSX.Element => {
  const [selectedRowForEditing, setSelectedRowForEditing] = createSignal<RentalDataGrid>(
    {} as RentalDataGrid
  )
  const [isNicknameModalOpen, setIsNicknameModalOpen] = createSignal(false)
  const [isTerminateRentalModalOpen, setIsTerminateRentalModalOpen] = createSignal(false)
  const [isDegenModalOpen, setIsDegenModalOpen] = createSignal<boolean>(false)
  const [selectedDegen, setSelectedDegen] = createSignal<Degen | undefined>(undefined)
  const [isRentDialog, setIsRentDialog] = createSignal<boolean>(false)
  const [tableState, setTableState] = useQueryStates(rentalSearchParsers, {
    history: 'push',
    shallow: true,
  })
  const sort = createMemo<SortState | null>(() =>
    tableState.sort ? { field: tableState.sort, direction: tableState.direction } : null
  )
  const pageSize = () => Number(tableState.pageSize)
  const page = () => normalizePage(tableState.page) - 1
  const [columnVisibilityModel] = useLocalStorage<ColumnVisibilityModel>(
    RENTAL_COLUMN_VISIBILITY,
    {}
  )

  const playerProfile = usePlayerProfile()
  const rentals = createMemo(() => transformRentals(props.rows, playerProfile.profile?.id || ''))

  const filteredRows = createMemo(() => {
    switch (props.category) {
      case 'direct-rental':
        return rentals().filter((rental) => rental.category === 'direct-rental')
      case 'owned-sponsorship':
        return rentals().filter((rental) => rental.category === 'owned-sponsorship')
      case 'non-owned-sponsorship':
        return rentals().filter((rental) => rental.category === 'non-owned-sponsorship')
      case 'recruited':
        return rentals().filter((rental) => rental.category === 'recruited')
      case 'direct-renter':
        return rentals().filter((rental) => rental.category === 'direct-renter')
      case 'terminated':
        return rentals().filter((rental) => rental.action)
      case 'all':
      default:
        return rentals()
    }
  })

  const sortedRows = createMemo(() => {
    const activeSort = sort()
    if (!activeSort) {
      return filteredRows()
    }

    return filteredRows().toSorted((a, b) => {
      const aValue = a[activeSort.field as keyof RentalDataGrid] as number
      const bValue = b[activeSort.field as keyof RentalDataGrid] as number

      if (activeSort.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      }

      return aValue > bValue ? -1 : 1
    })
  })

  const handleOpenNickname = (params: RenderCellParams) => {
    setSelectedRowForEditing(() => params.row)
    setIsNicknameModalOpen(true)
  }

  const handleUpdateNickname = (name: string, rentalId: string) => {
    props.updateRentalName(name, rentalId)
    setIsNicknameModalOpen(false)
  }

  const handleOpenTerminateRental = (params: RenderCellParams) => {
    setSelectedRowForEditing(() => params.row)
    setIsTerminateRentalModalOpen(true)
  }

  const handleConfirmTerminateRental = () => {
    const row = selectedRowForEditing()
    if (row) {
      props.onTerminateRental(row.rentalId)
      setIsTerminateRentalModalOpen(false)
    }
  }

  const handleClickDegenId = (params: RenderCellParams) => {
    setSelectedDegen({ ...params.row, id: params.row.degenId } as unknown as Degen)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }

  const handleSortClick = (field: string) => {
    const activeSort = sort()
    if (!activeSort || activeSort.field !== field) {
      void setTableState({ sort: field, direction: 'asc', page: 1 })
    } else if (activeSort.direction === 'asc') {
      void setTableState({ direction: 'desc', page: 1 })
    } else {
      void setTableState({ sort: null, direction: null, page: 1 })
    }
  }

  const handlePageSizeChange = (value: string) => {
    if (value === '10' || value === '25' || value === '100') {
      void setTableState({ pageSize: value, page: 1 })
    }
  }

  const handlePrevPage = () => {
    void setTableState({ page: Math.max(1, page()) })
  }

  const handleNextPage = () => {
    void setTableState({ page: Math.min(pageCount(), page() + 2) })
  }

  const columns = createMemo<TableColumn[]>(() => {
    const results: TableColumn[] = [
      {
        field: 'action',
        headerName: 'Actions',
        width: 130,
        minWidth: 100,
        renderCell: (params: RenderCellParams) => (
          <Show
            when={['direct-rental', 'non-owned-sponsorship', 'owned-sponsorship'].includes(
              params.row.category
            )}
          >
            <Button
              onClick={() => handleOpenTerminateRental(params)}
              variant="outline"
              disabled={Boolean(params.value)}
            >
              {params.value ? 'Terminated' : 'Terminate'}
            </Button>
          </Show>
        ),
      },
      {
        field: 'renter',
        headerName: 'Player',
        width: 120,
        renderCell: (params: RenderCellParams) => (
          <div class="flex flex-row items-center gap-2">
            <span class="text-base">{params.value as JSX.Element}</span>
          </div>
        ),
      },
      {
        field: 'playerNickname',
        headerName: 'Player Nickname',
        width: 150,
        renderCell: (params: RenderCellParams) => {
          return (
            <div class="flex flex-row items-center gap-2">
              <span class="text-base">{params.value as JSX.Element}</span>
              <Show when={(params.row as { isEditable?: boolean }).isEditable}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit player nickname"
                  onClick={() => handleOpenNickname(params)}
                  class="hidden cursor-pointer group-hover:block"
                >
                  <Pencil aria-hidden="true" size={20} stroke-width={1.5} />
                </Button>
              </Show>
            </div>
          )
        },
      },
      { field: 'rentalCategory', headerName: 'Category', width: 150 },
      {
        field: 'degenId',
        headerName: 'Degen ID',
        renderCell: (params: RenderCellParams) => (
          <button
            type="button"
            class="cursor-pointer text-foreground underline decoration-foreground"
            onClick={() => handleClickDegenId(params)}
          >
            #{params.value as JSX.Element}
          </button>
        ),
      },
      { field: 'background', headerName: 'Background' },
      { field: 'tribe', headerName: 'Tribe' },
      {
        field: 'earningCap',
        headerName: 'Earning Cap',
        width: 150,
        renderCell: (params: RenderCellParams) => (
          <span class="text-base">
            {formatNumberToDisplay(params.row.totalEarnings)} /{' '}
            {formatNumberToDisplay(params.value as number)}
          </span>
        ),
      },
      {
        field: 'rentalRenewsIn',
        headerName: 'Rental Renews In',
        minWidth: 100,
        width: 150,
        renderCell: (params: RenderCellParams) => (
          <span class="text-warning">
            <Countdown date={new Date((params.value as number) * 1000)} />
          </span>
        ),
      },
      { field: 'multiplier', headerName: 'Multiplier', width: 150, minWidth: 100 },
      { field: 'matches', headerName: 'Matches' },
      { field: 'wins', headerName: 'Wins' },
      {
        field: 'winRate',
        headerName: 'Win Rate',
        minWidth: 100,
        renderCell: (params: RenderCellParams) => (
          <span>{formatNumberToDisplay(params.value as number)}%</span>
        ),
      },
      { field: 'weeklyFee', headerName: 'Weekly Fee', minWidth: 100 },
      {
        field: 'dailyFee',
        headerName: 'Current Daily Fee',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        minWidth: 100,
      },
      {
        field: 'dailyFeesToDate',
        headerName: 'Daily Fees To Date',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        minWidth: 100,
      },
      {
        field: 'costs',
        headerName: 'Rental Fee Costs',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        minWidth: 100,
      },
      {
        field: 'rentalFeeEarning',
        headerName: 'Rental Fees Earned',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        minWidth: 100,
      },
      {
        field: 'profits',
        headerName: 'Gross Gameplay Earnings',
        width: 180,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        minWidth: 100,
      },
      {
        field: 'netGameEarning',
        headerName: 'Net Gameplay Earnings',
        width: 200,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        minWidth: 100,
      },
      {
        field: 'netEarning',
        headerName: 'Net Earnings',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        minWidth: 100,
      },
      {
        field: 'roi',
        headerName: 'ROI %',
        minWidth: 100,
        renderCell: (params: RenderCellParams) => {
          const value = params.value as number
          const colorClass =
            value === 0 ? 'text-foreground' : value > 0 ? 'text-success' : 'text-error'
          return <span class={colorClass}>{formatNumberToDisplay(value)}%</span>
        },
      },
    ]

    if (props.category === 'direct-renter') {
      return results.filter((result) => result.field !== 'action')
    }

    return results
  })

  const visibleColumns = createMemo(() => {
    const visibility = columnVisibilityModel()
    return visibility ? columns().filter((col) => visibility[col.field] !== false) : columns()
  })

  const paginatedRows = createMemo(() =>
    sortedRows().slice(page() * pageSize(), (page() + 1) * pageSize())
  )

  const pageCount = () => Math.max(1, Math.ceil(sortedRows().length / pageSize()))

  createEffect(() => {
    const normalizedPage = Math.min(page() + 1, pageCount())
    if (tableState.page !== normalizedPage) {
      void setTableState({ page: normalizedPage }, { history: 'replace' })
    }
  })

  return (
    <Show
      when={!props.loading}
      fallback={
        <div class="flex h-full items-center justify-center">
          <CircularProgress size="lg" />
        </div>
      }
    >
      <div class="flex h-full flex-col">
        <div class="flex-1 overflow-auto rounded-lg border bg-background">
          <Table aria-label="rentals data table" class="border-collapse">
            <TableHeader class="sticky top-0 z-10 bg-background">
              <TableRow class="border-0 hover:bg-transparent">
                <For each={visibleColumns()}>
                  {(column) => (
                    <TableHead
                      aria-sort={
                        sort()?.field === column.field
                          ? sort()?.direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                      }
                      class="min-w-(--col-min-w) px-4 py-3 text-left font-medium text-muted-foreground"
                      style={{ '--col-min-w': `${column.width ?? 100}px` }}
                    >
                      <button
                        type="button"
                        onClick={() => handleSortClick(column.field)}
                        class="flex items-center gap-1 text-left font-medium text-muted-foreground"
                      >
                        {column.headerName || column.field}
                        <Show when={sort()?.field === column.field}>
                          <Show
                            when={sort()?.direction === 'asc'}
                            fallback={
                              <ChevronDown aria-hidden="true" size={18} stroke-width={1.5} />
                            }
                          >
                            <ChevronUp aria-hidden="true" size={18} stroke-width={1.5} />
                          </Show>
                        </Show>
                      </button>
                    </TableHead>
                  )}
                </For>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Show
                when={sortedRows().length > 0}
                fallback={
                  <TableRow>
                    <TableCell colSpan={visibleColumns().length} class="px-4 py-3">
                      <span class="text-muted-foreground">No rentals found</span>
                    </TableCell>
                  </TableRow>
                }
              >
                <For each={paginatedRows()}>
                  {(row) => (
                    <TableRow class="group hover:bg-accent/50">
                      <For each={visibleColumns()}>
                        {(column) => (
                          <TableCell
                            class="min-w-(--col-min-w) px-4 py-3 align-top"
                            style={{ '--col-min-w': `${column.width ?? 100}px` }}
                          >
                            {column.renderCell
                              ? column.renderCell({
                                  value: row[column.field as keyof RentalDataGrid],
                                  row,
                                  field: column.field,
                                  id: row.id,
                                })
                              : String(row[column.field as keyof RentalDataGrid] ?? '')}
                          </TableCell>
                        )}
                      </For>
                    </TableRow>
                  )}
                </For>
              </Show>
            </TableBody>
          </Table>
        </div>
        <div class="flex items-center justify-between border-t px-4 py-3">
          <div class="flex items-center gap-2">
            <Select<number>
              options={PAGE_SIZE_OPTIONS}
              optionValue={(option) => String(option)}
              optionTextValue={(option) => String(option)}
              value={pageSize()}
              onValueChange={(value) => handlePageSizeChange(String(value))}
              itemComponent={(itemProps) => (
                <SelectItem item={itemProps.item}>{itemProps.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger aria-label="Rows per page" class="w-17.5">
                <SelectValue<number> />
              </SelectTrigger>
              <SelectContent />
            </Select>
            <span class="text-sm text-muted-foreground">Rows per page</span>
          </div>
          <PaginationControls
            hasNext={page() < pageCount() - 1 && sortedRows().length > 0}
            hasPrev={page() > 0}
            onClickNext={handleNextPage}
            onClickPrev={handlePrevPage}
            pageLabel={
              <span class="text-sm">
                Page {page() + 1} of {pageCount()}
              </span>
            }
            buttonClassName="h-8 w-8 p-0"
          />
        </div>
      </div>

      {/* Nickname Degen Dialog */}
      <Dialog
        open={isNicknameModalOpen()}
        onOpenChange={(open) => !open && setIsNicknameModalOpen(false)}
      >
        <DialogContent showCloseButton={false} class="max-w-95 md:max-w-95 lg:max-w-95">
          <DeferredChangeNicknameDialog
            open={isNicknameModalOpen()}
            updateNickname={handleUpdateNickname}
            rental={selectedRowForEditing()}
          />
        </DialogContent>
      </Dialog>

      {/* Terminate Rental Dialog */}
      <Dialog
        open={isTerminateRentalModalOpen()}
        onOpenChange={(open) => !open && setIsTerminateRentalModalOpen(false)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle class="text-center text-xl">
              Are you sure you want to terminate this rental?
            </DialogTitle>
          </DialogHeader>
          <div class="flex flex-col items-center gap-2">
            <Button onClick={handleConfirmTerminateRental} variant="default" class="w-full">
              Terminate Rental
            </Button>
            <Button onClick={() => setIsTerminateRentalModalOpen(false)} class="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Degen Traits Dialog */}
      <Show when={isDegenModalOpen()}>
        <DeferredDegenDialog
          open
          degen={selectedDegen()}
          isRent={isRentDialog()}
          setIsRent={setIsRentDialog}
          onClose={() => setIsDegenModalOpen(false)}
        />
      </Show>
    </Show>
  )
}

export default MyRentalsDataGrid
