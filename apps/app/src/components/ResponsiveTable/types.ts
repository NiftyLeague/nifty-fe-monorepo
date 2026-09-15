import type { JSX } from 'solid-js'

export type Row = { id?: string | number; user_id?: string; [key: string]: unknown }

export interface GridRenderCellParams {
  value?: unknown
  row: Row
  field?: string
  id?: string | number
}

export interface CustomColDef {
  field: string
  headerName?: string
  width?: number
  minWidth?: number
  flex?: number
  align?: 'left' | 'center' | 'right'
  type?: string
  sortable?: boolean
  renderCell?: (params: GridRenderCellParams) => JSX.Element
}

export const getRowId = (row: Row): string | number => {
  if (typeof row.id === 'string' || typeof row.id === 'number') return row.id
  if (typeof row.user_id === 'string') return row.user_id
  if (typeof row.rank === 'string' || typeof row.rank === 'number') return row.rank
  return ''
}


export type Row = { id?: string | number; user_id?: string; [key: string]: unknown }

export interface GridRenderCellParams {
  value?: unknown
  row: Row
  field?: string
  id?: string | number
}

export interface CustomColDef {
  field: string
  headerName?: string
  width?: number
  minWidth?: number
  flex?: number
  align?: 'left' | 'center' | 'right'
  type?: string
  sortable?: boolean
  renderCell?: (params: GridRenderCellParams) => JSX.Element
}

export const getRowId = (row: Row): string | number => {
  if (typeof row.id === 'string' || typeof row.id === 'number') return row.id
  if (typeof row.user_id === 'string') return row.user_id
  if (typeof row.rank === 'string' || typeof row.rank === 'number') return row.rank
  return ''
}
