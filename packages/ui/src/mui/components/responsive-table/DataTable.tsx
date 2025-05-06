import type { Dispatch, SetStateAction } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { CustomColDef, DataGridProps, GridRenderCellParams, Row } from './types';

interface DataTableProps {
  columns: CustomColDef[];
  count: number;
  data: Row[];
  DataGridProps?: DataGridProps;
  noContentText?: string;
  onPaginationModelChange: Dispatch<SetStateAction<{ pageSize: number; page: number }>>;
  paginationModel: { pageSize: number; page: number };
  rowsClassArray?: string[];
  showPagination?: boolean;
}

// Convert our custom column definition to MUI's GridColDef
const convertToGridColDef = (col: CustomColDef): CustomColDef => {
  const { renderCell, ...rest } = col;
  return {
    ...rest,
    renderCell: renderCell
      ? params =>
          renderCell({
            value: params.value,
            row: params.row as Row,
            field: params.field as string,
            id: params.id,
          } as GridRenderCellParams)
      : undefined,
  };
};

/**
 * Material-ui DataGrid component
 */
export default function DataTable(props: DataTableProps) {
  // const getRowClass = (index: number) => {
  //   const { rowsClassArray } = props;
  //   return rowsClassArray && rowsClassArray[index] ? rowsClassArray[index] : '';
  // };

  const { columns, data, paginationModel, onPaginationModelChange, DataGridProps } = props;

  return (
    <Box
      sx={{
        height: 52 * (paginationModel.pageSize + 1) + 86,
        width: '100%',
        '.MuiDataGrid-cell:focus, .MuiDataGrid-columnHeader:focus, .MuiDataGrid-columnHeader:focus-within ': {
          outline: 'none !important',
        },
        '.MuiDataGrid-root, .MuiDataGrid-footerContainer ': {
          border: 'none',
        },
        '.MuiDataGrid-columnHeaders, .MuiDataGrid-cell': {
          borderBottom: '1px solid #d5d9e915 !important',
          zIndex: 1,
        },
        '.MuiDataGrid-iconSeparator': {
          display: 'none',
        },
      }}
    >
      <DataGrid
        columns={columns.map(convertToGridColDef)}
        disableColumnMenu
        disableRowSelectionOnClick
        getRowId={row => (typeof row.id === 'string' || typeof row.id === 'number' ? row.id : row.rank)}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        rows={data}
        {...DataGridProps}
      />
    </Box>
  );
}
