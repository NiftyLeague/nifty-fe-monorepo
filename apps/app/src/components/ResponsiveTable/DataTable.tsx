'use client'

import type { ReactNode } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nl/ui/base/table'

import { CustomColDef, getRowId, Row } from './types'

interface DataTableProps {
  columns: CustomColDef[]
  data: Row[]
  noContentText?: string
  paginationModel: { pageSize: number; page: number }
}

/**
 * Read-only leaderboard table built from the shared shadcn table primitives.
 */
export default function DataTable(props: DataTableProps) {
  const { columns, data, paginationModel, noContentText } = props

  return (
    <div
      style={{ height: 52 * (paginationModel.pageSize + 1) + 86, width: '100%' }}
      class="h-full w-full overflow-hidden"
    >
      <div class="h-full max-h-[750px] overflow-auto rounded-lg border bg-background">
        <Table aria-label="data table" class="border-collapse">
          <TableHeader class="sticky top-0 z-10 bg-background">
            <TableRow class="border-0 hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.field}
                  align={column.align || 'left'}
                  style={{ 'min-width': column.width }}
                  class="px-4 py-3 font-medium text-muted-foreground"
                >
                  {column.headerName || column.field}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} class="px-4 py-3">
                  <span class="text-muted-foreground">{noContentText ?? 'No Content'}</span>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const rowId = getRowId(row)
                return (
                  <TableRow key={String(rowId)} class="hover:bg-accent/50">
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        align={column.align || 'left'}
                        class="px-4 py-3"
                      >
                        {column.renderCell
                          ? (column.renderCell({
                              value: row[column.field],
                              row,
                              field: column.field,
                              id: row.id,
                            }) as ReactNode)
                          : String(row[column.field] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
