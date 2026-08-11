'use client'

import { useState, useMemo } from 'react'
import { Button } from '@nl/ui/base/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@nl/ui/base/dialog'
import { Icon } from '@nl/ui/base/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nl/ui/base/select'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { formatNumberToDisplay } from '@nl/ui/utils'
import type { Rentals, RentalType } from '@/types/rentals'
import type { Degen } from '@/types/degens'
import { transformRentals } from '@/app/(private-routes)/dashboard/_utils/transformRentals'
import usePlayerProfile from '@/hooks/usePlayerProfile'
import { Countdown } from '@nl/ui/base/countdown'
import useLocalStorage from '@/hooks/useLocalStorage'

import DeferredDegenDialog from '@/components/providers/DeferredDegenDialog'
import { RentalDataGrid } from '@/types/rentalDataGrid'
import ChangeNicknameDialog from './ChangeNicknameDialog'

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
  renderCell?: (params: RenderCellParams) => React.ReactNode
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

const MyRentalsDataGrid = ({
  rows,
  loading,
  category,
  onTerminateRental,
  updateRentalName,
}: Props): React.ReactNode => {
  const [selectedRowForEditing, setSelectedRowForEditing] = useState<RentalDataGrid>(
    {} as RentalDataGrid
  )
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false)
  const [isTerminateRentalModalOpen, setIsTerminateRentalModalOpen] = useState(false)
  const [isDegenModalOpen, setIsDegenModalOpen] = useState<boolean>(false)
  const [selectedDegen, setSelectedDegen] = useState<Degen | undefined>(undefined)
  const [isRentDialog, setIsRentDialog] = useState<boolean>(false)
  const [sort, setSort] = useState<SortState | null>(null)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)
  const [columnVisibilityModel, setColumnVisibilityModel] = useLocalStorage<ColumnVisibilityModel>(
    RENTAL_COLUMN_VISIBILITY,
    {}
  )

  const { profile } = usePlayerProfile()
  const rentals = transformRentals(rows, profile?.id || '', category)

  const filteredRows = useMemo(() => {
    switch (category) {
      case 'direct-rental':
        return rentals.filter((rental) => rental.category === 'direct-rental')
      case 'owned-sponsorship':
        return rentals.filter((rental) => rental.category === 'owned-sponsorship')
      case 'non-owned-sponsorship':
        return rentals.filter((rental) => rental.category === 'non-owned-sponsorship')
      case 'recruited':
        return rentals.filter((rental) => rental.category === 'recruited')
      case 'direct-renter':
        return rentals.filter((rental) => rental.category === 'direct-renter')
      case 'terminated':
        return rentals.filter((rental) => rental.action)
      case 'all':
      default:
        return rentals
    }
  }, [rentals, category])

  const sortedRows = useMemo(() => {
    if (!sort) {
      return filteredRows
    }

    return [...filteredRows].sort((a, b) => {
      const aValue = a[sort.field as keyof RentalDataGrid] as number
      const bValue = b[sort.field as keyof RentalDataGrid] as number

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      }

      return aValue > bValue ? -1 : 1
    })
  }, [filteredRows, sort])

  const handleOpenNickname = (params: RenderCellParams) => {
    setSelectedRowForEditing(params.row)
    setIsNicknameModalOpen(true)
  }

  const handleUpdateNickname = (name: string, rentalId: string) => {
    updateRentalName(name, rentalId)
    setIsNicknameModalOpen(false)
  }

  const handleOpenTerminateRental = (params: RenderCellParams) => {
    setSelectedRowForEditing(params.row)
    setIsTerminateRentalModalOpen(true)
  }

  const handleConfirmTerminateRental = () => {
    if (selectedRowForEditing) {
      onTerminateRental(selectedRowForEditing.rentalId)
      setIsTerminateRentalModalOpen(false)
    }
  }

  const handleClickDegenId = (params: RenderCellParams) => {
    setSelectedDegen({ ...params.row, id: params.row.degenId } as unknown as Degen)
    setIsRentDialog(false)
    setIsDegenModalOpen(true)
  }

  const handleSortClick = (field: string) => {
    if (!sort || sort.field !== field) {
      setSort({ field, direction: 'asc' })
    } else if (sort.direction === 'asc') {
      setSort({ field, direction: 'desc' })
    } else {
      setSort(null)
    }
  }

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setPage(0)
  }

  const handlePrevPage = () => {
    setPage((p) => Math.max(0, p - 1))
  }

  const handleNextPage = () => {
    setPage((p) => Math.min(pageCount - 1, p + 1))
  }

  const commonColumnProp = { minWidth: 100 }

  const columns: TableColumn[] = useMemo(() => {
    const results: TableColumn[] = [
      {
        field: 'action',
        headerName: 'Actions',
        width: 130,
        ...commonColumnProp,
        renderCell: (params: RenderCellParams) => (
          <>
            {['direct-rental', 'non-owned-sponsorship', 'owned-sponsorship'].includes(
              params.row.category
            ) && (
              <Button
                onClick={() => handleOpenTerminateRental(params)}
                variant="outline"
                disabled={Boolean(params.value)}
              >
                {params.value ? 'Terminated' : 'Terminate'}
              </Button>
            )}
          </>
        ),
      },
      {
        field: 'renter',
        headerName: 'Player',
        width: 120,
        renderCell: (params: RenderCellParams) => (
          <div className="flex flex-row items-center gap-2">
            <span className="text-base">{params.value as React.ReactNode}</span>
          </div>
        ),
      },
      {
        field: 'playerNickname',
        headerName: 'Player Nickname',
        width: 150,
        renderCell: (params: RenderCellParams) => {
          return (
            <div className="flex flex-row items-center gap-2">
              <span className="text-base">{params.value as React.ReactNode}</span>
              {(params.row as { isEditable?: boolean }).isEditable && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="edit"
                  onClick={() => handleOpenNickname(params)}
                  className="hidden cursor-pointer group-hover:block"
                >
                  <Icon name="pencil" />
                </Button>
              )}
            </div>
          )
        },
      },
      { field: 'rentalCategory', headerName: 'Category', width: 150 },
      // {
      //   field: 'player',
      //   headerName: "Who's playing?",
      //   width: 130,
      // },
      {
        field: 'degenId',
        headerName: 'Degen ID',
        renderCell: (params: RenderCellParams) => (
          <button
            type="button"
            className="cursor-pointer text-foreground underline decoration-foreground"
            onClick={() => handleClickDegenId(params)}
          >
            #{params.value as React.ReactNode}
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
          <span className="text-base">
            {formatNumberToDisplay(params.row.totalEarnings)} /{' '}
            {formatNumberToDisplay(params.value as number)}
          </span>
        ),
      },
      {
        field: 'rentalRenewsIn',
        headerName: 'Rental Renews In',
        ...commonColumnProp,
        width: 150,
        renderCell: (params: RenderCellParams) => (
          <span className="text-warning">
            <Countdown date={new Date((params.value as number) * 1000)} />
          </span>
        ),
      },
      { field: 'multiplier', headerName: 'Multiplier', width: 150, ...commonColumnProp },
      // {
      //   field: 'timePlayed',
      //   headerName: 'Time Played',
      //   ...commonColumnProp,
      //   width: 120,
      // },
      { field: 'matches', headerName: 'Matches' },
      { field: 'wins', headerName: 'Wins' },
      {
        field: 'winRate',
        headerName: 'Win Rate',
        ...commonColumnProp,
        renderCell: (params: RenderCellParams) => (
          <span>{formatNumberToDisplay(params.value as number)}%</span>
        ),
      },
      { field: 'weeklyFee', headerName: 'Weekly Fee', ...commonColumnProp },
      {
        field: 'dailyFee',
        headerName: 'Current Daily Fee',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        ...commonColumnProp,
      },
      {
        field: 'dailyFeesToDate',
        headerName: 'Daily Fees To Date',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        ...commonColumnProp,
      },
      {
        field: 'costs',
        headerName: 'Rental Fee Costs',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        ...commonColumnProp,
      },
      {
        field: 'rentalFeeEarning',
        headerName: 'Rental Fees Earned',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        ...commonColumnProp,
      },
      {
        field: 'profits',
        headerName: 'Gross Gameplay Earnings',
        width: 180,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        ...commonColumnProp,
      },
      {
        field: 'netGameEarning',
        headerName: 'Net Gameplay Earnings',
        width: 200,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        ...commonColumnProp,
      },
      {
        field: 'netEarning',
        headerName: 'Net Earnings',
        width: 150,
        renderCell: (params: RenderCellParams) => formatNumberToDisplay(params.value as number),
        ...commonColumnProp,
      },
      {
        field: 'roi',
        headerName: 'ROI %',
        ...commonColumnProp,
        renderCell: (params: RenderCellParams) => {
          const value = params.value as number
          const colorClass =
            value === 0 ? 'text-foreground' : value > 0 ? 'text-success' : 'text-error'
          return <span className={colorClass}>{formatNumberToDisplay(value)}%</span>
        },
      },
    ]

    if (category === 'direct-renter') {
      return results.filter((result) => result.field !== 'action')
    }

    return results
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const visibleColumns = useMemo(
    () =>
      columnVisibilityModel
        ? columns.filter((col) => columnVisibilityModel[col.field] !== false)
        : columns,
    [columns, columnVisibilityModel]
  )

  const paginatedRows = useMemo(
    () => sortedRows.slice(page * pageSize, (page + 1) * pageSize),
    [sortedRows, page, pageSize]
  )

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize))

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <CircularProgress size="lg" />
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto rounded-lg border bg-background">
          <table className="w-full border-collapse text-sm" aria-label="rentals data table">
            <thead className="sticky top-0 z-10 bg-background">
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.field}
                    data-sortable={column.sortable !== false}
                    style={{ minWidth: column.width }}
                    className="px-4 py-3 text-left font-medium text-muted-foreground"
                  >
                    <button
                      type="button"
                      onClick={() => handleSortClick(column.field)}
                      className="flex items-center gap-1 text-left font-medium text-muted-foreground"
                    >
                      {column.headerName || column.field}
                      {sort?.field === column.field && (
                        <Icon
                          name={sort.direction === 'asc' ? 'chevron-up' : 'chevron-down'}
                          size="sm"
                        />
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length} className="px-4 py-3">
                    <span className="text-muted-foreground">No rentals found</span>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id || ''} className="group hover:bg-accent/50">
                    {visibleColumns.map((column) => (
                      <td
                        key={column.field}
                        style={{ minWidth: column.width }}
                        className="px-4 py-3 align-top"
                      >
                        {column.renderCell
                          ? column.renderCell({
                              value: row[column.field as keyof RentalDataGrid],
                              row,
                              field: column.field,
                              id: row.id,
                            })
                          : String(row[column.field as keyof RentalDataGrid] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="flex items-center gap-2">
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={String(opt)}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">Rows per page</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={page === 0}
              className="h-8 w-8 cursor-pointer p-0"
            >
              <Icon name="chevron-left" size="sm" />
            </Button>
            <span className="text-sm">
              Page {page + 1} of {pageCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={page === pageCount - 1 || sortedRows.length === 0}
              className="h-8 w-8 cursor-pointer p-0"
            >
              <Icon name="chevron-right" size="sm" />
            </Button>
          </div>
        </div>
      </div>

      {/* Nickname Degen Dialog */}
      <Dialog
        open={isNicknameModalOpen}
        onOpenChange={(open) => !open && setIsNicknameModalOpen(false)}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[380px] md:max-w-[380px] lg:max-w-[380px]"
        >
          <ChangeNicknameDialog
            updateNickname={handleUpdateNickname}
            rental={selectedRowForEditing}
          />
        </DialogContent>
      </Dialog>

      {/* Terminate Rental Dialog */}
      <Dialog
        open={isTerminateRentalModalOpen}
        onOpenChange={(open) => !open && setIsTerminateRentalModalOpen(false)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Are you sure you want to terminate this rental?
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-2">
            <Button onClick={handleConfirmTerminateRental} variant="default" className="w-full">
              Terminate Rental
            </Button>
            <Button onClick={() => setIsTerminateRentalModalOpen(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Degen Traits Dialog */}
      {isDegenModalOpen && (
        <DeferredDegenDialog
          open
          degen={selectedDegen}
          isRent={isRentDialog}
          setIsRent={setIsRentDialog}
          onClose={() => setIsDegenModalOpen(false)}
        />
      )}
    </>
  )
}

export default MyRentalsDataGrid
