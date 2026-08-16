'use client'

import { useEffect, useMemo, useState } from 'react'

import { CircularProgress } from '@nl/ui/custom/circular-progress'
import { ResponsiveTable } from '@/components/ResponsiveTable'
import type { ReturnDataType, TableProps, TableRowType } from '@/types/leaderboard'
import { fetchScores } from '@/utils/leaderboard'
import LeaderboardRankBoundary from '../LeaderboardRankBoundary'

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
  const [count, setCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState({ pageSize: 50, page: 0 })
  const [rows, setData] = useState<Record<string, unknown>[] | null>()

  const fetchTopData = async () => {
    setPaginationModel((model) => ({ pageSize: model.pageSize, page: 0 }))
    const returnValue: ReturnDataType = await fetchScores(
      selectedGame,
      selectedTable.key,
      selectedTimeFilter,
      paginationModel.pageSize,
      0
    )
    const leaderBoardValue: Record<string, unknown>[] = []
    returnValue.data.forEach((value) => {
      leaderBoardValue.push(flatObject(value))
    })

    setData(leaderBoardValue)
    setCount(returnValue.count)
  }

  useEffect(() => {
    setData(null)
    fetchTopData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame, selectedTable.key, selectedTimeFilter])

  const handleChangePage = async (newPage: number) => {
    if (rows && (newPage + 1) * paginationModel.pageSize > rows?.length && rows?.length < count) {
      const returnValue: ReturnDataType = await fetchScores(
        selectedGame,
        selectedTable.key,
        selectedTimeFilter,
        paginationModel.pageSize,
        newPage * paginationModel.pageSize
      )
      const leaderBoardValue: Record<string, unknown>[] = []
      returnValue.data.forEach((value) => {
        leaderBoardValue.push(flatObject(value))
      })
      setData([...rows, ...leaderBoardValue])
      setCount(returnValue.count)
    }
  }

  useEffect(() => {
    if (paginationModel.page !== 0) {
      handleChangePage(paginationModel.page)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page])

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
      {!rows ? (
        <div className="absolute flex h-[70%] w-full items-center justify-center">
          <CircularProgress size="lg" />
        </div>
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
            count={count}
          />
        </div>
      )}
    </div>
  )
}
