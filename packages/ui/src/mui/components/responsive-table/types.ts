import { ReactNode } from 'react';
import type { DataGridProps, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import type { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import type { AccordionProps } from '@mui/material/Accordion';
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import type { TypographyProps } from '@mui/material/Typography';
import type { TablePaginationProps } from '@mui/material/TablePagination';
import type { SvgIconProps } from '@mui/material/SvgIcon';

export type Row = {
  id?: string | number;
  user_id?: string;
  [key: string]: unknown;
};

export interface CustomColDef extends Omit<GridColDef, 'renderCell'> {
  renderCell?: (params: GridRenderCellParams) => ReactNode;
}

export type {
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummaryProps,
  DataGridProps,
  GridRenderCellParams,
  SvgIconProps,
  TablePaginationProps,
  TypographyProps,
};
