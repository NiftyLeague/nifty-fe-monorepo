'use client'
import { useEffect, useMemo } from 'react'
import dynamic from '@/runtime/dynamic'
import { useQueryStates } from 'nuqs'

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
import { leaderboardSearchParsers } from '@/url/search-state'

const EnhancedTable = dynamic(() => import('./EnhancedTable/EnhancedTable'), {
  ssr: false,
  loading: () => <div className="flex min-h-96 items-center justify-center" aria-busy="true" />,
})

export default function LeaderBoards(): React.ReactNode {
  const [searchState, setSearchState] = useQueryStates(leaderboardSearchParsers, {
    history: 'push',
    shallow: true,
  })
  const selectedGame = searchState.game
  const page = Math.max(1, searchState.page)
  const currentGame =
    LEADERBOARD_GAME_LIST.find((game) => game.key === selectedGame) ??
    (LEADERBOARD_GAME_LIST[0] as LeaderboardGame)
  const selectedTable = useMemo(
    () =>
      currentGame.tables.find((table) => table.key === searchState.table) ??
      (currentGame.tables[0] as TableType),
    [currentGame, searchState.table]
  )
  const selectedType = selectedTable.key
  const selectedTimeFilter =
    selectedGame === 'nftl_burner' && searchState.time === 'weekly' ? 'all_time' : searchState.time

  useEffect(() => {
    gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, {
      content_type: 'leaderboard',
      content_id: selectedGame,
    })
  }, [selectedGame])

  const handleChangeGame = (gameKey: string) => {
    const nextGame = LEADERBOARD_GAME_LIST.find((game) => game.key === gameKey)
    if (!nextGame) return
    const { tables } = nextGame
    void setSearchState({
      game: gameKey as typeof searchState.game,
      table: (tables[0] as TableType).key,
      time: gameKey === 'nftl_burner' && selectedTimeFilter === 'weekly' ? 'all_time' : undefined,
      page: 1,
    })
  }

  const handleChangeType = (tableKey: string) => {
    const table = currentGame.tables.find((candidate: TableType) => candidate.key === tableKey)
    if (table) void setSearchState({ table: table.key, page: 1 })
  }

  const handleChangeTimeFilter = (selected: string) => {
    if (selectedTimeFilter !== selected) {
      void setSearchState({ time: selected as typeof searchState.time, page: 1 })
    }
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
        page={page}
        onPageChange={(nextPage) => void setSearchState({ page: nextPage })}
        selectedGame={selectedGame}
        selectedTable={selectedTable}
        selectedTimeFilter={selectedTimeFilter}
      />
    </div>
  )
}
