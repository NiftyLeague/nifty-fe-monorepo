import type { Component } from 'solid-js'
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
 */
const ResponsiveTable: Component<ResponsiveTableProps> = (props) => {
  const handleChangePage = (_event: MouseEvent | null, page: number) => {
    props.onPaginationModelChange((model) => ({ page, pageSize: model.pageSize }))
  }

  const handleSelectionChange = (selected: { rowIds: (string | number)[] }) => {
    props.onSelectionChange?.(selected)
  }

  return (
    <div>
      {/* DESKTOP BIG TABLE */}
      <div class="hidden lg:block">
        <DataTable
          columns={props.columns}
          data={props.data}
          noContentText={props.noContentText}
          paginationModel={props.paginationModel}
        />
      </div>

      {/* MOBILE EXPANDABLE LIST OF CARDS */}
      <div class="lg:hidden">
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
      </div>
    </div>
  )
}

export default ResponsiveTable
