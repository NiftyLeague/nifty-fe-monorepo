import type { Dispatch, SetStateAction } from 'react'
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
  showPagination: boolean
}

/**
 * Responsive read-only leaderboard table and accessible expandable mobile list.
 */
const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
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
  showPagination,
}) => {
  const handleChangePage = (event: React.MouseEvent | null, page: number) => {
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
      <div className="hidden lg:block">
        <DataTable
          columns={columns}
          data={data}
          noContentText={noContentText}
          paginationModel={paginationModel}
        />
      </div>

      {/* MOBILE EXPANDABLE LIST OF CARDS */}
      <div className="lg:hidden">
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
          showPagination={showPagination}
        />
      </div>
    </div>
  )
}

export default ResponsiveTable
