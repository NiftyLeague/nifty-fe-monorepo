import { Show, createMemo, type Component } from 'solid-js'

import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import DataList from './DataList'
import DataTable from './DataTable'
import type { CustomColDef, Row } from './types'

type ResponsiveTableProps = {
  checkboxSelection?: boolean
  columns: CustomColDef[]
  count: number
  data: Row[]
  excludePrimaryFromDetails?: boolean
  noContentText?: string
  onPaginationModelChange: (
    updater: (model: { pageSize: number; page: number }) => {
      pageSize: number
      page: number
    }
  ) => void
  onSelectionChange?: (selected: { rowIds: (string | number)[] }) => void
  paginationModel: { pageSize: number; page: number }
  rowsClassArray?: string[]
  serverPaginated?: boolean
  showPagination: boolean
}

/**
 * Responsive read-only leaderboard table and accessible expandable mobile list.
 *
 * Only the active breakpoint variant is created: Solid has no virtual DOM to
 * hide the other tree behind `hidden` classes, so mounting both would build
 * every row twice (50 rows × N columns of real DOM per table).
 */
const ResponsiveTable: Component<ResponsiveTableProps> = (props) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const handleChangePage = (_event: MouseEvent | null, page: number) => {
    props.onPaginationModelChange((model) => ({ page, pageSize: model.pageSize }))
  }

  const handleSelectionChange = (selected: { rowIds: (string | number)[] }) => {
    props.onSelectionChange?.(selected)
  }

  const desktopTable = createMemo(() => (
    <DataTable
      columns={props.columns}
      data={props.data}
      noContentText={props.noContentText}
      paginationModel={props.paginationModel}
    />
  ))

  return (
    <Show
      when={isDesktop()}
      fallback={
        <DataList
          checkboxSelection={props.checkboxSelection}
          columns={props.columns}
          count={props.count}
          data={props.data}
          excludePrimaryFromDetails={props.excludePrimaryFromDetails}
          noContentText={props.noContentText}
          onChangePage={handleChangePage}
          onSelectionChange={handleSelectionChange}
          page={props.paginationModel.page}
          rowsClassArray={props.rowsClassArray}
          rowsPerPage={props.paginationModel.pageSize}
          serverPaginated={props.serverPaginated}
          showPagination={props.showPagination}
        />
      }
    >
      {desktopTable()}
    </Show>
  )
}

export default ResponsiveTable
