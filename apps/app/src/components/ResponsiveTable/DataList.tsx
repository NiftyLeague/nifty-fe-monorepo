'use client'

import { useState } from 'react'
import { Checkbox } from '@nl/ui/base/checkbox'

import { CellRenderer, LabelRenderer } from './Renderer'
import ExpandableListItem from './ExpandableListItem'
import NoContent from './NoContent'
import Pagination from './Pagination'

import type { IconProps } from '@nl/ui/base/icon'
import type {
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummaryProps,
  CustomColDef,
  Row,
  TablePaginationProps,
  TypographyProps,
} from './types'

interface DataListProps {
  AccordionDetailsProps?: AccordionDetailsProps
  AccordionDetailsTypographyProps?: TypographyProps<'div'>
  AccordionMoreIconProps?: IconProps
  AccordionProps?: AccordionProps
  AccordionSummaryProps?: AccordionSummaryProps
  AccordionSummaryTypographyProps?: TypographyProps
  checkboxSelection?: boolean
  columns: CustomColDef[]
  count: number
  data: Row[]
  excludePrimaryFromDetails?: boolean
  noContentText?: string
  onChangePage: (event: React.MouseEvent | null, page: number) => void
  onSelectionChange: (params: { rowIds: (string | number)[] }) => void
  page: number
  rowsClassArray?: string[]
  rowsPerPage: number
  scrollOptions?: ScrollIntoViewOptions
  scrollToSelected?: boolean
  SelectedAccordionProps?: AccordionProps
  showPagination: boolean
  TablePaginationProps?: TablePaginationProps
}

/**
 * List with expandable items - mobile table analogue
 */
const DataList: React.FC<DataListProps> = (props) => {
  const {
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
    excludePrimaryFromDetails,
    noContentText,
    onChangePage,
    onSelectionChange,
    page,
    rowsClassArray,
    rowsPerPage,
    scrollOptions,
    scrollToSelected = false,
    SelectedAccordionProps,
    showPagination,
    TablePaginationProps,
  } = props

  const [selection, setSelection] = useState<(string | number)[]>([])

  const handleChangePage = (event: React.MouseEvent | null, page: number) =>
    onChangePage(event, page)

  const handleSelection = (row: Row) => {
    const newSelection = [...selection]
    const rowId = row.id || (row.user_id as string | number)
    if (newSelection.indexOf(rowId) === -1) {
      newSelection.push(rowId)
    } else {
      newSelection.splice(newSelection.indexOf(rowId), 1)
    }
    setSelection(newSelection)
    onSelectionChange({ rowIds: newSelection })
  }

  const handleSelectAll = () => {
    let newSelection = [...selection]
    if (newSelection.length > 0) {
      newSelection = []
    } else {
      newSelection = data.map((row) => row.id || (row.user_id as string | number))
    }
    setSelection(newSelection)
    onSelectionChange({ rowIds: newSelection })
  }

  const getRowClass = (index: number) => {
    return rowsClassArray && rowsClassArray[index] ? rowsClassArray[index] : ''
  }

  const createListItemTitle = (columns: CustomColDef[], row: Row, data: Row[]) => {
    const primaryColumns = columns.filter(
      (column) => column.field === 'id' || column.field === 'user_id'
    )
    const firstColumn = columns[0]
    if (!firstColumn) return null

    return primaryColumns.length === 0 ? (
      <CellRenderer column={firstColumn} row={row} data={data} />
    ) : (
      primaryColumns.map((column, index) => (
        <span key={column.field} className={index === 0 ? 'flex-[0.5]' : 'flex-[1]'}>
          <CellRenderer column={column} row={row} data={data} />
        </span>
      ))
    )
  }

  const createListItemDescription = (
    columns: CustomColDef[],
    row: Row,
    data: Row[],
    excludePrimary = false
  ) => (
    <div>
      {columns
        .filter((column) => !excludePrimary || column.field !== 'id')
        .map((column, index) => (
          <div key={`${column.headerName}-${index}`} className="flex w-full flex-row gap-4">
            <div className="flex-1">
              <LabelRenderer column={column} data={data} />
            </div>
            <div className="flex-1">
              <CellRenderer column={column} row={row} data={data} />
            </div>
          </div>
        ))}
    </div>
  )

  if (
    !Array.isArray(data) ||
    data.length === 0 ||
    !Array.isArray(columns) ||
    columns.length === 0
  ) {
    return <NoContent text={noContentText} />
  }

  return (
    <div>
      {checkboxSelection && (
        <div style={{ padding: `12px 16px` }}>
          <Checkbox
            style={{ padding: `0 10px 5px 0` }}
            checked={
              selection.length === data.length
                ? true
                : selection.length > 0
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={() => handleSelectAll()}
          />
          <span className="text-sm">Select All</span>
        </div>
      )}
      {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
        <ExpandableListItem
          AccordionDetailsProps={AccordionDetailsProps}
          AccordionDetailsTypographyProps={AccordionDetailsTypographyProps}
          AccordionMoreIconProps={AccordionMoreIconProps}
          AccordionProps={AccordionProps}
          AccordionSummaryProps={AccordionSummaryProps}
          AccordionSummaryTypographyProps={AccordionSummaryTypographyProps}
          checkboxSelection={checkboxSelection}
          details={createListItemDescription(columns, row, data, excludePrimaryFromDetails)}
          key={index}
          onSelect={handleSelection}
          panelClass={getRowClass(index)}
          row={row}
          scrollOptions={scrollOptions}
          scrollToSelected={scrollToSelected}
          selected={selection.indexOf(row.id as string | number) !== -1}
          SelectedAccordionProps={SelectedAccordionProps}
          summary={createListItemTitle(columns, row, data)}
        />
      ))}
      {showPagination && (
        <Pagination
          component="div"
          {...(TablePaginationProps as TablePaginationProps)}
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
        />
      )}
    </div>
  )
}

export default DataList
