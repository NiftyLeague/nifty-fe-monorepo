import React, { ReactNode } from 'react'
import type { LucideProps } from 'lucide-react'

export type Row = { id?: string | number; user_id?: string; [key: string]: unknown }

export type ResponsiveIconProps = Omit<LucideProps, 'size'> & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
}

export interface GridRenderCellParams {
  value?: unknown
  row: Row
  field?: string
  id?: string | number
}

export interface GridColDef {
  field: string
  headerName?: string
  width?: number
  minWidth?: number
  flex?: number
  align?: 'left' | 'center' | 'right'
  type?: string
  sortable?: boolean
  renderCell?: (params: GridRenderCellParams) => ReactNode
}

export interface CustomColDef extends Omit<GridColDef, 'renderCell'> {
  renderCell?: (params: GridRenderCellParams) => ReactNode
}

export interface TypographyProps<T = unknown> {
  sx?: React.CSSProperties
  style?: React.CSSProperties
  component?: T
  gutterBottom?: boolean
  variant?: string
  className?: string
  children?: React.ReactNode
}

export interface AccordionProps {
  className?: string
  sx?: React.CSSProperties
  style?: React.CSSProperties
  children?: React.ReactNode
  [key: string]: unknown
}

export interface AccordionSummaryProps {
  expandIcon?: React.ReactNode
  sx?: React.CSSProperties
  style?: React.CSSProperties
  children?: React.ReactNode
  [key: string]: unknown
}

export interface AccordionDetailsProps {
  sx?: React.CSSProperties
  style?: React.CSSProperties
  children?: React.ReactNode
  [key: string]: unknown
}

export interface TablePaginationProps {
  sx?: React.CSSProperties
  className?: string
  style?: React.CSSProperties
}

export interface DataGridProps {
  [key: string]: unknown
}
