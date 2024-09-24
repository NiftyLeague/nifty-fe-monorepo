/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Dispatch, SetStateAction } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

interface DataTableProps {
  columns: GridColDef[];
  count: number;
  data: any[];
  DataGridProps?: any;
  noContentText?: string;
  onPaginationModelChange: Dispatch<SetStateAction<{ pageSize: number; page: number }>>;
  paginationModel: { pageSize: number; page: number };
  rowsClassArray?: string[];
  showPagination?: boolean;
  TableBodyCellProps?: any;
  TableBodyProps?: any;
  TableBodyRowProps?: any;
  TableHeadCellProps?: any;
  TableHeadProps?: any;
  TableHeadRowProps?: any;
  TablePaginationProps?: any;
  TableProps?: any;
}

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
        columns={columns}
        rows={data}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        disableSelectionOnClick
        disableColumnMenu
        // rowCount={count}
        getRowId={row => row.rank}
        pageSizeOptions={[10, 25, 50]}
        {...DataGridProps}
      />
    </Box>
  );
}
