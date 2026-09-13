'use client'

import { useEffect, useMemo, type SetStateAction } from 'react'

import { Preloader } from '@nl/ui/custom/preloader'
import { ResponsiveTable } from '@/components/ResponsiveTable'
import type { TableProps, TableRowType } from '@/types/leaderboard'
import { useLeaderboardScores } from '@/hooks/queries/useLeaderboardScores'
import LeaderboardRankBoundary from '../LeaderboardRankBoundary'
import QueryErrorState from '@/components/QueryErrorState'

const flatObject = (obj: { [key: string]: unknown }): Record<string, unknown> => {
  const flattened: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object') {
      Object.assign(flattened, flatObject(value as { [key: string]: unknown }))
    } else {
      flattened[key] = value
    }
  }
  return flattened
}

export default function EnhancedTable({
  page,
  onPageChange,
  selectedGame,
  selectedTable,
  selectedTimeFilter,
}: TableProps): React.ReactNode | null {
  const paginationModel = { pageSize: 50, page: Math.max(0, page - 1) }
  const { data, error, isPending, refetch } = useLeaderboardScores(
    selectedGame,
    selectedTable.key,
    selectedTimeFilter,
    paginationModel.pageSize,
    paginationModel.page * paginationModel.pageSize
  )
  const rows = useMemo(() => data?.data.map(flatObject) ?? [], [data?.data])
  const maxPage = Math.max(1, Math.ceil((data?.count ?? 0) / paginationModel.pageSize))

  useEffect(() => {
    if (!isPending && page > maxPage) onPageChange(maxPage)
  }, [isPending, maxPage, onPageChange, page])

  const handlePaginationModelChange = (
    update: SetStateAction<{ pageSize: number; page: number }>
  ) => {
    const next = typeof update === 'function' ? update(paginationModel) : update
    onPageChange(next.page + 1)
  }

  const columns = useMemo(() => {
    const baseColumns: Array<{
      field: string
      headerName: string
      width: number
      primary?: boolean
    }> = [
      { field: 'rank', headerName: 'RANK', width: 100, primary: true },
      { field: 'user_id', headerName: 'USERNAME', width: 250, primary: true },
    ]

    return baseColumns.concat(
      selectedTable.rows.map((headerCell: TableRowType) => ({
        field: headerCell.key,
        headerName: headerCell.display,
        width: 250,
        primary: headerCell.primary,
      }))
    )
  }, [selectedTable.rows])

  return (
    <div className="relative mb-20 min-h-96 sm:mb-0">
      {isPending ? (
        <Preloader ready={false} progress={0} label="Loading leaderboard" />
      ) : error ? (
        <QueryErrorState
          error={error}
          onRetry={() => void refetch()}
          className="flex min-h-72 items-center justify-center gap-3 text-error"
        />
      ) : (
        <div className="relative">
          <LeaderboardRankBoundary
            selectedGame={selectedGame}
            selectedTable={selectedTable.key}
            selectedTimeFilter={selectedTimeFilter}
          />
          <ResponsiveTable
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            columns={columns}
            showPagination={true}
            data={rows}
            count={data?.count ?? 0}
            serverPaginated
          />
        </div>
      )}
    </div>
  )
}
