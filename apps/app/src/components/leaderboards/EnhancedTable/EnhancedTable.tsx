'use client'

import { useMemo, useState } from 'react'

import { CircularProgress } from '@nl/ui/custom/circular-progress'
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
  selectedGame,
  selectedTable,
  selectedTimeFilter,
}: TableProps): React.ReactNode | null {
  const [paginationModel, setPaginationModel] = useState({ pageSize: 50, page: 0 })
  const { data, error, isPending, refetch } = useLeaderboardScores(
    selectedGame,
    selectedTable.key,
    selectedTimeFilter,
    paginationModel.pageSize,
    paginationModel.page * paginationModel.pageSize
  )
  const rows = useMemo(() => data?.data.map(flatObject) ?? [], [data?.data])

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
    <div className="mb-20 sm:mb-0">
      {isPending ? (
        <div className="absolute flex h-[70%] w-full items-center justify-center">
          <CircularProgress size="lg" />
        </div>
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
            onPaginationModelChange={setPaginationModel}
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
