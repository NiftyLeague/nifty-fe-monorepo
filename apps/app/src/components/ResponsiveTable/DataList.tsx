'use client'

import { createSignal, For, Show } from 'solid-js'
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
  onChangePage: (event: MouseEvent | null, page: number) => void
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
    <For each={primaryColumns}>
      {(column, index) => (
        <span class={index() === 0 ? 'flex-[0.5]' : 'flex-[1]'}>
          <CellRenderer column={column} row={row} data={rows} />
        </span>
      )}
    </For>
  )
}

const createListItemDescription = (
  tableColumns: CustomColDef[],
  row: Row,
  rows: Row[],
  excludePrimary = false
) => (
  <div>
    <For each={tableColumns.filter((column) => !excludePrimary || column.field !== 'id')}>
      {(column) => (
        <div class="flex w-full flex-row gap-4">
          <div class="flex-1">
            <LabelRenderer column={column} data={rows} />
          </div>
          <div class="flex-1">
            <CellRenderer column={column} row={row} data={rows} />
          </div>
        </div>
      )}
    </For>
  </div>
)

/**
 * List with expandable items - mobile table analogue
 */
const DataList = (props: DataListProps) => {
  const scrollToSelected = () => props.scrollToSelected ?? false
  const serverPaginated = () => props.serverPaginated ?? false

  const [selection, setSelection] = createSignal<(string | number)[]>([])

  const handleChangePage = (event: MouseEvent | null, nextPage: number) =>
    props.onChangePage(event, nextPage)

  const handleSelection = (row: Row) => {
    const newSelection = [...selection()]
    const rowId = getRowId(row)
    if (newSelection.indexOf(rowId) === -1) {
      newSelection.push(rowId)
    } else {
      newSelection.splice(newSelection.indexOf(rowId), 1)
    }
    setSelection(newSelection)
    props.onSelectionChange({ rowIds: newSelection })
  }

  const handleSelectAll = () => {
    let newSelection = [...selection()]
    if (newSelection.length > 0) {
      newSelection = []
    } else {
      newSelection = props.data.map(getRowId)
    }
    setSelection(newSelection)
    props.onSelectionChange({ rowIds: newSelection })
  }

  const getRowClass = (index: number) => {
    return props.rowsClassArray && props.rowsClassArray[index]
      ? props.rowsClassArray[index]
      : ''
  }

  const visibleRows = () =>
    serverPaginated()
      ? props.data
      : props.data.slice(
          props.page * props.rowsPerPage,
          props.page * props.rowsPerPage + props.rowsPerPage
        )

  const hasContent = () =>
    Array.isArray(props.data) &&
    props.data.length > 0 &&
    Array.isArray(props.columns) &&
    props.columns.length > 0

  return (
    <Show when={hasContent()} fallback={<NoContent text={props.noContentText} />}>
      <div>
        <Show when={props.checkboxSelection}>
          <div style={{ padding: '12px 16px' }}>
            <Checkbox
              style={{ padding: '0 10px 5px 0' }}
              checked={selection().length === props.data.length}
              indeterminate={
                selection().length > 0 && selection().length < props.data.length
              }
              onCheckedChange={() => handleSelectAll()}
            />
            <span class="text-sm">Select All</span>
          </div>
        </Show>
        <For each={visibleRows()}>
          {(row, index) => (
            <ExpandableListItem
              checkboxSelection={props.checkboxSelection}
              details={createListItemDescription(
                props.columns,
                row,
                props.data,
                props.excludePrimaryFromDetails
              )}
              onSelect={handleSelection}
              panelClass={getRowClass(index())}
              row={row}
              scrollOptions={props.scrollOptions}
              scrollToSelected={scrollToSelected()}
              selected={selection().indexOf(getRowId(row)) !== -1}
              summary={createListItemTitle(props.columns, row, props.data)}
            />
          )}
        </For>
        <Show when={props.showPagination}>
          <Pagination
            count={props.count}
            rowsPerPage={props.rowsPerPage}
            page={props.page}
            onChangePage={handleChangePage}
          />
        </Show>
      </div>
    </Show>
  )
}

export default DataList
