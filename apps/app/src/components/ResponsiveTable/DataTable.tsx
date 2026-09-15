'use client'

import { For, Show } from 'solid-js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nl/ui/base/table'

import { CustomColDef, Row } from './types'

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
  return (
    <div
      style={{
        height: `${52 * (props.paginationModel.pageSize + 1) + 86}px`,
        width: '100%',
      }}
      class="h-full w-full overflow-hidden"
    >
      <div class="h-full max-h-[750px] overflow-auto rounded-lg border bg-background">
        <Table aria-label="data table" class="border-collapse">
          <TableHeader class="sticky top-0 z-10 bg-background">
            <TableRow class="border-0 hover:bg-transparent">
              <For each={props.columns}>
                {(column) => (
                  <TableHead
                    align={column.align || 'left'}
                    style={{ 'min-width': `${column.width}px` }}
                    class="px-4 py-3 font-medium text-muted-foreground"
                  >
                    {column.headerName || column.field}
                  </TableHead>
                )}
              </For>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show
              when={props.data.length > 0}
              fallback={
                <TableRow>
                  <TableCell colSpan={props.columns.length} class="px-4 py-3">
                    <span class="text-muted-foreground">
                      {props.noContentText ?? 'No Content'}
                    </span>
                  </TableCell>
                </TableRow>
              }
            >
              <For each={props.data}>
                {(row) => (
                  <TableRow class="hover:bg-accent/50">
                    <For each={props.columns}>
                      {(column) => (
                        <TableCell
                          align={column.align || 'left'}
                          class="px-4 py-3"
                        >
                          {column.renderCell
                            ? column.renderCell({
                                value: row[column.field],
                                row,
                                field: column.field,
                                id: row.id,
                              })
                            : String(row[column.field] ?? '')}
                        </TableCell>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </Show>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
