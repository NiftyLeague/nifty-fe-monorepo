/* eslint-disable @typescript-eslint/no-explicit-any */

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

interface DataTableProps {
  data: any[];
  onChangePage: (event: React.MouseEvent | null, page: number) => void;
  rowsClassArray?: string[];
  columns: GridColDef[];
  count: number;
  page: number;
  rowsPerPage: number;
  DataGridProps?: any;
  noContentText?: string;
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

  const { columns, count, data, page, rowsPerPage, DataGridProps } = props;

  return (
    <Box
      sx={{
        height: 52 * (rowsPerPage + 1) + 86,
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
        pageSize={rowsPerPage}
        page={page}
        disableSelectionOnClick
        disableColumnMenu
        rowCount={count}
        onPageChange={props.onChangePage}
        getRowId={row => row.rank}
        {...DataGridProps}
      />
    </Box>
  );
}
