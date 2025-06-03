import { ReactNode } from 'react';
import { CustomColDef, GridRenderCellParams, Row } from './types';

interface RendererProps {
  column: CustomColDef;
  row: Row;
  data: Row[];
}

export const CellRenderer = ({ column, row }: RendererProps): ReactNode => {
  const value = row[column.field] as ReactNode;
  if (typeof column.renderCell === 'function') {
    return column.renderCell({ value, row, field: column.field, id: row.id } as GridRenderCellParams);
  }
  return value;
};

interface LabelRendererProps {
  column: CustomColDef;
  data: Row[];
}

export const LabelRenderer = ({ column }: LabelRendererProps): string =>
  column.headerName?.toUpperCase() || column.field.toUpperCase();
