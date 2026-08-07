'use client'

import type { Dispatch, SetStateAction, ReactNode } from 'react'
import { CustomColDef, DataGridProps, Row } from './types'

interface DataTableProps {
  columns: CustomColDef[]
  count: number
  data: Row[]
  DataGridProps?: DataGridProps
  noContentText?: string
  onPaginationModelChange: Dispatch<SetStateAction<{ pageSize: number; page: number }>>
  paginationModel: { pageSize: number; page: number }
  rowsClassArray?: string[]
  showPagination?: boolean
}

const getRowId = (row: Row) =>
  typeof row.id === 'string' || typeof row.id === 'number' ? row.id : row.rank

/**
 * Read-only data grid rendered as a semantic HTML table (replaces the legacy DataGrid).
 */
export default function DataTable(props: DataTableProps) {
  const { columns, data, paginationModel, noContentText } = props

  return (
    <div
      style={{ height: 52 * (paginationModel.pageSize + 1) + 86, width: '100%' }}
      className="h-full w-full overflow-hidden"
    >
      <div className="h-full max-h-[750px] overflow-auto rounded-lg border bg-background">
        <table className="w-full border-collapse text-sm" aria-label="data table">
          <thead className="sticky top-0 z-10 bg-background">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.field}
                  align={column.align || 'left'}
                  style={{ minWidth: column.width }}
                  className="px-4 py-3 font-medium text-muted-foreground"
                >
                  {column.headerName || column.field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-3">
                  <span className="text-muted-foreground">{noContentText ?? 'No Content'}</span>
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row)
                return (
                  <tr key={String(rowId)} className="hover:bg-accent/50">
                    {columns.map((column) => (
                      <td key={column.field} align={column.align || 'left'} className="px-4 py-3">
                        {column.renderCell
                          ? (column.renderCell({
                              value: row[column.field],
                              row,
                              field: column.field,
                              id: row.id,
                            }) as ReactNode)
                          : String(row[column.field] ?? '')}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
