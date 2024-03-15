/* eslint-disable @typescript-eslint/no-explicit-any */

export const CellRenderer = ({ column, row }: { column: any; row: any; data: any }) => {
  let cell = row[column.field];
  if (column.valueGetter) {
    cell = column.valueGetter({ value: cell, data: row });
  }
  if (column.renderCell) {
    cell = column.renderCell({ value: cell, data: row });
  }
  return cell;
};

export const LabelRenderer = ({ column, data }: { column: any; data: any }) =>
  column.renderLabel ? column.renderLabel(column, data) : column?.headerName?.toUpperCase();
