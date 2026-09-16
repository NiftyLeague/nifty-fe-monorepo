import { createEffect, createMemo, For, Show, type JSX } from 'solid-js'
import dynamic from '@/runtime/dynamic'
import { useQueryStates } from '@/url/nuqs-solid'

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
import RouteLoading from '@nl/ui/custom/route-loading'

const EnhancedTable = dynamic(() => import('./EnhancedTable/EnhancedTable'), {
  ssr: false,
  loading: () => <RouteLoading label="Loading leaderboards" />,
})

export default function LeaderBoards(): JSX.Element {
  const [searchState, setSearchState] = useQueryStates(leaderboardSearchParsers, {
    history: 'push',
  })
  const selectedGame = () => searchState.game
  const page = () => Math.max(1, searchState.page)
  const currentGame = () =>
    LEADERBOARD_GAME_LIST.find((game) => game.key === selectedGame()) ??
    (LEADERBOARD_GAME_LIST[0] as LeaderboardGame)
  const selectedTable = createMemo(
    () =>
      currentGame().tables.find((table) => table.key === searchState.table) ??
      (currentGame().tables[0] as TableType)
  )
  const selectedType = () => selectedTable().key
  const selectedTimeFilter = () =>
    selectedGame() === 'nftl_burner' && searchState.time === 'weekly'
      ? 'all_time'
      : searchState.time

  createEffect(() => {
    gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, {
      content_type: 'leaderboard',
      content_id: selectedGame(),
    })
  })

  const handleChangeGame = (gameKey: string) => {
    const nextGame = LEADERBOARD_GAME_LIST.find((game) => game.key === gameKey)
    if (!nextGame) return
    const { tables } = nextGame
    void setSearchState({
      game: gameKey as typeof searchState.game,
      table: (tables[0] as TableType).key,
      time: gameKey === 'nftl_burner' && selectedTimeFilter() === 'weekly' ? 'all_time' : undefined,
      page: 1,
    })
  }

  const handleChangeType = (tableKey: string) => {
    const table = currentGame().tables.find((candidate: TableType) => candidate.key === tableKey)
    if (table) void setSearchState({ table: table.key, page: 1 })
  }

  const handleChangeTimeFilter = (selected: string) => {
    if (selectedTimeFilter() !== selected) {
      void setSearchState({ time: selected as typeof searchState.time, page: 1 })
    }
  }

  // TODO: Enable all times if updated leaderboard incorporated
  const timeFilters = LEADERBOARD_TIME_FILTERS.filter((item) => item.key === 'all_time')

  return (
    <div class="mx-auto">
      <div class="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        <div class="min-w-41">
          <Select<LeaderboardGame>
            options={LEADERBOARD_GAME_LIST}
            optionValue="key"
            optionTextValue="display"
            value={LEADERBOARD_GAME_LIST.find((game) => game.key === selectedGame())}
            onValueChange={(option) => option && handleChangeGame((option as LeaderboardGame).key)}
            itemComponent={(itemProps) => (
              <SelectItem item={itemProps.item}>{itemProps.item.rawValue.display}</SelectItem>
            )}
          >
            <SelectTrigger class="py-1.5" aria-label="Game">
              <SelectValue<LeaderboardGame> />
            </SelectTrigger>
            <SelectContent />
          </Select>
        </div>
        <Show when={selectedGame() === 'nifty_smashers'}>
          <div class="min-w-30">
            <Select<TableType>
              options={NiftySmashersTables}
              optionValue="key"
              optionTextValue="display"
              value={NiftySmashersTables.find((table) => table.key === selectedType())}
              onValueChange={(option) => option && handleChangeType((option as TableType).key)}
              itemComponent={(itemProps) => (
                <SelectItem item={itemProps.item}>{itemProps.item.rawValue.display}</SelectItem>
              )}
            >
              <SelectTrigger class="py-1.5" aria-label="Score type">
                <SelectValue<TableType> />
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>
        </Show>
        <div class="flex">
          <For each={timeFilters}>
            {(item) => (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="h-auto rounded-none px-3 py-0.5"
                onClick={() => handleChangeTimeFilter(item.key)}
              >
                <span class="font-bold uppercase text-base text-inherit">{item.display}</span>
              </Button>
            )}
          </For>
        </div>
      </div>
      <EnhancedTable
        page={page()}
        onPageChange={(nextPage) => void setSearchState({ page: nextPage })}
        selectedGame={selectedGame()}
        selectedTable={selectedTable()}
        selectedTimeFilter={selectedTimeFilter()}
      />
    </div>
  )
}
