'use client'
/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nl/ui/base/select'
import { Button } from '@nl/ui/base/button'
import * as gtm from '@nl/ui/gtm/events'
import { EVENTS as GTM_EVENTS } from '@nl/ui/gtm/constants'
import type { LeaderboardGame, TableType } from '@/types/leaderboard'
import {
  LEADERBOARD_GAME_LIST,
  LEADERBOARD_TIME_FILTERS,
  NiftySmashersTables,
} from '@/constants/leaderboards'
import './modal-table.css'

const EnhancedTable = dynamic(() => import('./EnhancedTable/EnhancedTableWithWallet'), {
  ssr: false,
  loading: () => <div className="flex min-h-96 items-center justify-center" aria-busy="true" />,
})

export default function LeaderBoards(): React.ReactNode {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { game: defaultGame } = Object.fromEntries(searchParams.entries())
  const [selectedGame, setGame] = useState<string>(
    defaultGame && LEADERBOARD_GAME_LIST.some((game) => game.key === defaultGame)
      ? defaultGame
      : (LEADERBOARD_GAME_LIST as [LeaderboardGame])[0].key
  )
  const [selectedTable, setTable] = useState<TableType>(NiftySmashersTables[0] as TableType)
  const [selectedType, setType] = useState<string>((NiftySmashersTables[0] as TableType).key)
  const [selectedTimeFilter, setTimeFilter] = useState<string>('all_time')

  useEffect(() => {
    gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, {
      content_type: 'leaderboard',
      content_id: selectedGame,
    })
    if (searchParams.get('game') !== selectedGame) {
      const params = new URLSearchParams(searchParams)
      params.set('game', selectedGame)
      router.push(pathname + '?' + params.toString())
    }
  }, [selectedGame, router, pathname, searchParams])

  const handleChangeGame = (gameKey: string) => {
    setGame(gameKey)

    const currentGame = LEADERBOARD_GAME_LIST.filter((game) => game.key === gameKey)?.[0]
    if (!currentGame) return
    const { display, tables } = currentGame

    if (gameKey === 'nftl_burner' && selectedTimeFilter === 'weekly') {
      // Since NFTL Burner doesn't have weekly leaderboard
      // we will set to default all_time
      setTimeFilter('all_time')
    }
    setTable(tables[0] as TableType)
    setType((tables[0] as TableType).key)
  }

  const handleChangeType = (tableKey: string) => {
    const table = NiftySmashersTables.find((t: TableType) => t.key === tableKey)
    if (table) {
      setTable(table)
      setType(table.key)
    }
  }

  const handleChangeTimeFilter = (selected: string) => {
    if (selectedTimeFilter != selected) setTimeFilter(selected)
  }

  // TODO: Enable all times if updated leaderboard incorporated
  const timeFilters = LEADERBOARD_TIME_FILTERS.filter((item) => item.key === 'all_time')

  return (
    <div className="mx-auto">
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        <div className="min-w-[164px]">
          <Select value={selectedGame} onValueChange={handleChangeGame}>
            <SelectTrigger className="py-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEADERBOARD_GAME_LIST.map((item) => (
                <SelectItem value={item.key} key={item.key}>
                  {item.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedGame === 'nifty_smashers' && (
          <div className="min-w-[120px]">
            <Select value={selectedType} onValueChange={handleChangeType}>
              <SelectTrigger className="py-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NiftySmashersTables.map((item) => (
                  <SelectItem value={item.key} key={item.key}>
                    {item.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex">
          {timeFilters.map((item) => (
            <Button
              type="button"
              key={item.key}
              variant="ghost"
              size="sm"
              className="h-auto rounded-none px-3 py-0.5"
              onClick={() => handleChangeTimeFilter(item.key)}
            >
              <span className="font-bold uppercase text-base text-inherit">{item.display}</span>
            </Button>
          ))}
        </div>
      </div>
      <EnhancedTable
        selectedGame={selectedGame}
        selectedTable={selectedTable}
        selectedTimeFilter={selectedTimeFilter}
      />
    </div>
  )
}
