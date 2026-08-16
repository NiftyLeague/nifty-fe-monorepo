'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { toast } from 'sonner'

import { CircularProgress } from '@nl/ui/custom/circular-progress'
import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'
import useAuth from '@/hooks/useAuth'
import usePlayerProfile from '@/hooks/usePlayerProfile'
import { ResponsiveTable } from '@/components/ResponsiveTable'
import type { ReturnDataType, TableProps, TableRowType } from '@/types/leaderboard'
import { fetchRankByUserId, fetchScores } from '@/utils/leaderboard'
import { errorMsgHandler } from '@/utils/errorHandlers'

const TopModal = dynamic(() => import('../TopModal'), { ssr: false })

const flatObject = (obj: { [key: string]: unknown }): Record<string, unknown> => {
  const keys = Object.keys(obj)
  return keys.reduce(
    (acc, k) => {
      const value = obj[k]
      return typeof value === 'object'
        ? { ...acc, ...flatObject(value as { [key: string]: unknown }) }
        : { ...acc, [k]: value }
    },
    {} as Record<string, unknown>
  )
}

export default function EnhancedTable({
  selectedGame,
  selectedTable,
  selectedTimeFilter,
}: TableProps): React.ReactNode | null {
  const [count, setCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState({ pageSize: 50, page: 0 })
  const [rows, setData] = useState<Record<string, unknown>[] | null>()
  const [myRank, setMyRank] = useState<number>()
  const [isRankModalOpen, setIsRankModalOpen] = useState(false)
  const { isLoggedIn } = useAuth()
  const { profile } = usePlayerProfile()

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

  const handleCheckYourRank = async () => {
    gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, {
      content_type: 'leaderboard_rank',
      content_id: selectedGame,
    })
    const errorMes =
      'You have not played the game yet! Play the game to see your rank on the leaderboard.'

    if (!profile?.id) {
      toast.error(errorMes)
      return
    }
    try {
      const result: unknown = await fetchRankByUserId(
        profile?.id,
        selectedGame,
        selectedTable.key,
        selectedTimeFilter
      )
      if (!result || typeof result !== 'object' || !('ok' in result) || !(result as Response).ok) {
        const errMsg =
          result && typeof result === 'object' && 'text' in result
            ? await (result as Response).text()
            : 'Unknown error'
        toast.error(errMsg)
        return
      }
      const res = await (result as Response).json()
      if (res < 1) {
        toast.error(errorMes)
        return
      }
      setMyRank(res)
      setIsRankModalOpen(true)
    } catch (error) {
      toast.error(errorMsgHandler(error))
      return
    }
  }

  const getColumns = () => {
    const columns: Array<{ field: string; headerName: string; width: number; primary?: boolean }> =
      [
        { field: 'rank', headerName: 'RANK', width: 100, primary: true },
        { field: 'user_id', headerName: 'USERNAME', width: 250, primary: true },
      ]
    selectedTable.rows.forEach((headerCell: TableRowType) => {
      columns.push({
        field: headerCell.key,
        headerName: headerCell.display,
        width: 250,
        primary: headerCell.primary,
      })
    })
    return columns
  }

  return (
    <div className="mb-20 sm:mb-0">
      {!rows ? (
        <div className="absolute flex h-[70%] w-full items-center justify-center">
          <CircularProgress size="lg" />
        </div>
      ) : (
        <div className="relative">
          {isLoggedIn && (
            <>
              <TopModal
                selectedGame={selectedGame}
                selectedTimeFilter={selectedTimeFilter}
                flag={selectedTable.key}
                myRank={myRank}
                onOpenChange={setIsRankModalOpen}
                open={isRankModalOpen}
              />
            </>
          )}
          {isLoggedIn && selectedGame !== 'crypto_winter' && (
            <button
              type="button"
              onClick={handleCheckYourRank}
              className="mb-4 flex cursor-pointer justify-end border-0 bg-transparent p-0 text-left lg:absolute lg:right-0 lg:mb-0 lg:translate-y-1/2"
              style={{ zIndex: 1000 }}
            >
              <span
                className="flex items-center justify-end text-base font-subheader font-bold text-[var(--color-purple)] underline"
                style={{ lineHeight: '24px' }}
              >
                <Image
                  src="/icons/rank_icon.svg"
                  alt="Rank Icon"
                  width={25}
                  height={20}
                  style={{ marginRight: 4 }}
                />
                RANK
              </span>
            </button>
          )}
          <ResponsiveTable
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            columns={getColumns()}
            showPagination={true}
            data={rows}
            count={count}
          />
        </div>
      )}
    </div>
  )
}
