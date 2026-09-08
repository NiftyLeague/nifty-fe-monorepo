'use client'

import { useState } from 'react'
import { Checkbox } from '@nl/ui/base/checkbox'

import { CellRenderer, LabelRenderer } from './Renderer'
import ExpandableListItem from './ExpandableListItem'
import NoContent from './NoContent'
import Pagination from './Pagination'

import { getRowId } from './types'
import type { CustomColDef, Row } from './types'

interface DataListProps {
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
  serverPaginated?: boolean
  showPagination: boolean
}

const createListItemTitle = (tableColumns: CustomColDef[], row: Row, rows: Row[]) => {
  const primaryColumns = tableColumns.filter(
    (column) => column.field === 'id' || column.field === 'user_id'
  )
  const firstColumn = tableColumns[0]
  if (!firstColumn) return null

  return primaryColumns.length === 0 ? (
    <CellRenderer column={firstColumn} row={row} data={rows} />
  ) : (
    primaryColumns.map((column, index) => (
      <span key={column.field} className={index === 0 ? 'flex-[0.5]' : 'flex-[1]'}>
        <CellRenderer column={column} row={row} data={rows} />
      </span>
    ))
  )
}

const createListItemDescription = (
  tableColumns: CustomColDef[],
  row: Row,
  rows: Row[],
  excludePrimary = false
) => (
  <div>
    {tableColumns
      .filter((column) => !excludePrimary || column.field !== 'id')
      .map((column, index) => (
        <div key={`${column.headerName}-${index}`} className="flex w-full flex-row gap-4">
          <div className="flex-1">
            <LabelRenderer column={column} data={rows} />
          </div>
          <div className="flex-1">
            <CellRenderer column={column} row={row} data={rows} />
          </div>
        </div>
      ))}
  </div>
)

/**
 * List with expandable items - mobile table analogue
 */
const DataList: React.FC<DataListProps> = (props) => {
  const {
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
    serverPaginated = false,
    showPagination,
  } = props

  const [selection, setSelection] = useState<(string | number)[]>([])

  const handleChangePage = (event: React.MouseEvent | null, nextPage: number) =>
    onChangePage(event, nextPage)

  const handleSelection = (row: Row) => {
    const newSelection = [...selection]
    const rowId = getRowId(row)
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
      newSelection = data.map(getRowId)
    }
    setSelection(newSelection)
    onSelectionChange({ rowIds: newSelection })
  }

  const getRowClass = (index: number) => {
    return rowsClassArray && rowsClassArray[index] ? rowsClassArray[index] : ''
  }

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
      {(serverPaginated
        ? data
        : data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      ).map((row, index) => (
        <ExpandableListItem
          checkboxSelection={checkboxSelection}
          details={createListItemDescription(columns, row, data, excludePrimaryFromDetails)}
          key={String(getRowId(row)) || index}
          onSelect={handleSelection}
          panelClass={getRowClass(index)}
          row={row}
          scrollOptions={scrollOptions}
          scrollToSelected={scrollToSelected}
          selected={selection.indexOf(getRowId(row)) !== -1}
          summary={createListItemTitle(columns, row, data)}
        />
      ))}
      {showPagination && (
        <Pagination
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
