import type { Dispatch, SetStateAction } from 'react'
import DataList from './DataList'
import DataTable from './DataTable'

import type {
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummaryProps,
  CustomColDef,
  DataGridProps,
  Row,
  ResponsiveIconProps,
  TablePaginationProps,
  TypographyProps,
} from './types'

type ResponsiveTableProps = {
  AccordionDetailsProps?: AccordionDetailsProps
  AccordionDetailsTypographyProps?: TypographyProps<'div'>
  AccordionMoreIconProps?: ResponsiveIconProps
  AccordionProps?: AccordionProps
  AccordionSummaryProps?: AccordionSummaryProps
  AccordionSummaryTypographyProps?: TypographyProps
  checkboxSelection?: boolean
  columns: CustomColDef[]
  count: number
  data: Row[]
  DataGridProps?: DataGridProps
  excludePrimaryFromDetails?: boolean
  noContentText?: string
  onPaginationModelChange: Dispatch<SetStateAction<{ pageSize: number; page: number }>>
  onSelectionChange?: (selected: { rowIds: (string | number)[] }) => void
  paginationModel: { pageSize: number; page: number }
  rowsClassArray?: string[]
  showPagination: boolean
  TablePaginationProps?: TablePaginationProps
}

/**
 * Responsive read-only table (desktop devices) <-> read-only expandable list (tablet/mobile devices) for material-ui 1.0-beta.
 */
const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  AccordionDetailsProps,
  AccordionDetailsTypographyProps,
  AccordionMoreIconProps,
  AccordionProps,
  AccordionSummaryProps,
  AccordionSummaryTypographyProps,
  checkboxSelection,
  columns,
  count,
  data,
  DataGridProps,
  excludePrimaryFromDetails,
  noContentText,
  onPaginationModelChange,
  onSelectionChange,
  paginationModel,
  rowsClassArray,
  showPagination,
  TablePaginationProps,
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
          count={count}
          data={data}
          DataGridProps={DataGridProps}
          noContentText={noContentText}
          onPaginationModelChange={onPaginationModelChange}
          paginationModel={paginationModel}
          rowsClassArray={rowsClassArray}
          showPagination={showPagination}
        />
      </div>

      {/* MOBILE EXPANDABLE LIST OF CARDS */}
      <div className="lg:hidden">
        <DataList
          AccordionDetailsProps={AccordionDetailsProps}
          AccordionDetailsTypographyProps={AccordionDetailsTypographyProps}
          AccordionMoreIconProps={AccordionMoreIconProps}
          AccordionProps={AccordionProps}
          AccordionSummaryProps={AccordionSummaryProps}
          AccordionSummaryTypographyProps={AccordionSummaryTypographyProps}
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
          TablePaginationProps={TablePaginationProps}
        />
      </div>
    </div>
  )
}

export default ResponsiveTable
