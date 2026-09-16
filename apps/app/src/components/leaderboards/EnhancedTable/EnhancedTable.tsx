import { createEffect, createMemo, Match, Switch, type JSX } from 'solid-js'

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

export default function EnhancedTable(props: TableProps): JSX.Element | null {
  const paginationModel = () => ({
    pageSize: 50,
    page: Math.max(0, props.page - 1),
  })
  const query = useLeaderboardScores(
    () => props.selectedGame,
    () => props.selectedTable.key,
    () => props.selectedTimeFilter,
    () => paginationModel().pageSize,
    () => paginationModel().page * paginationModel().pageSize
  )
  const rows = createMemo(() => query.data?.data.map(flatObject) ?? [])
  const maxPage = () =>
    Math.max(1, Math.ceil((query.data?.count ?? 0) / paginationModel().pageSize))

  createEffect(() => {
    if (!query.isPending && props.page > maxPage()) props.onPageChange(maxPage())
  })

  const handlePaginationModelChange = (
    update:
      | { pageSize: number; page: number }
      | ((model: { pageSize: number; page: number }) => { pageSize: number; page: number })
  ) => {
    const next = typeof update === 'function' ? update(paginationModel()) : update
    props.onPageChange(next.page + 1)
  }

  const columns = createMemo(() => {
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
      props.selectedTable.rows.map((headerCell: TableRowType) => ({
        field: headerCell.key,
        headerName: headerCell.display,
        width: 250,
        primary: headerCell.primary,
      }))
    )
  })

  return (
    <div class="relative mb-20 min-h-96 sm:mb-0">
      <Switch
        fallback={
          <div class="relative">
            <LeaderboardRankBoundary
              selectedGame={props.selectedGame}
              selectedTable={props.selectedTable.key}
              selectedTimeFilter={props.selectedTimeFilter}
            />
            <ResponsiveTable
              paginationModel={paginationModel()}
              onPaginationModelChange={handlePaginationModelChange}
              columns={columns()}
              showPagination={true}
              data={rows()}
              count={query.data?.count ?? 0}
              serverPaginated
            />
          </div>
        }
      >
        <Match when={query.isPending}>
          <Preloader ready={false} progress={0} label="Loading leaderboard" />
        </Match>
        <Match when={query.error} keyed>
          {(error) => (
            <QueryErrorState
              error={error}
              onRetry={() => void query.refetch()}
              className="flex min-h-72 items-center justify-center gap-3 text-error"
            />
          )}
        </Match>
      </Switch>
    </div>
  )
}
