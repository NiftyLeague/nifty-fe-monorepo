import type { Dispatch, SetStateAction } from '@/types'
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
  onPaginationModelChange: Dispatch<SetStateAction<{ pageSize: number; page: number }>>
  onSelectionChange?: (selected: { rowIds: (string | number)[] }) => void
  paginationModel: { pageSize: number; page: number }
  rowsClassArray?: string[]
  serverPaginated?: boolean
  showPagination: boolean
}

/**
 * Responsive read-only leaderboard table and accessible expandable mobile list.
 */
const ResponsiveTable: Component<ResponsiveTableProps> = ({
  checkboxSelection,
  columns,
  count,
  data,
  excludePrimaryFromDetails,
  noContentText,
  onPaginationModelChange,
  onSelectionChange,
  paginationModel,
  rowsClassArray,
  serverPaginated,
  showPagination,
}) => {
  const handleChangePage = (event: MouseEvent | null, page: number) => {
    onPaginationModelChange((model) => ({ page, pageSize: model.pageSize }))
  }

  const handleSelectionChange = (selected: { rowIds: (string | number)[] }) => {
    if (onSelectionChange) {
      onSelectionChange(selected)
    }
  }

  return (
    <div>
      {/* DESKTOP BIG TABLE */}
      <div class="hidden lg:block">
        <DataTable
          columns={columns}
          data={data}
          noContentText={noContentText}
          paginationModel={paginationModel}
        />
      </div>

      {/* MOBILE EXPANDABLE LIST OF CARDS */}
      <div class="lg:hidden">
        <DataList
          checkboxSelection={checkboxSelection}
          columns={columns}
          count={count}
          data={data}
          excludePrimaryFromDetails={excludePrimaryFromDetails}
          noContentText={noContentText}
          onChangePage={handleChangePage}
          onSelectionChange={handleSelectionChange}
          page={paginationModel.page}
          rowsClassArray={rowsClassArray}
          rowsPerPage={paginationModel.pageSize}
          serverPaginated={serverPaginated}
          showPagination={showPagination}
        />
      </div>
    </div>
  )
}

export default ResponsiveTable
